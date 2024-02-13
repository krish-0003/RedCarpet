const { Sequelize, Op } = require('sequelize');
const model = require('../../database/models');
const errorMessage = require('../../utils/errorMessage');
const user = require('../../database/models/user');
const { getUsersStrings, userStatus, roles } = require('../../utils/strings');
const {
  NotFoundError,
  ValidationError,
  UnauthorizedRequestError,
  BadRequestError,
} = require('../../utils/customException');
const branch = require('../../database/models/branch');

const users = model.Users;
const branches = model.Branches;
const agencies = model.Agencies;
const departments = model.Departments;
const userRoles = model.UserRoles;
const userSoftwareMapping = model.UserSoftwares;
const software = model.Softwares;
const history = model.Histories;
const skills = model.Skills;
const softwareManagers = model.SoftwareManagers;
const clients = model.Clients;

const addMultipleUser = async (data, userObj) => {
  try {
    const createdUsers = await users.bulkCreate(data, { userObj });
    return createdUsers;
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      throw new BadRequestError(error.errors[0].message, error.errors[0].path);
    }
    let errorField;
    if (error.fields) errorField = Object.keys(error.fields)[0];
    throw new BadRequestError(error?.parent?.message, errorField);
  }
};
const changeStatusByUserId = async (userId, currentUser) => {
  const foundUser = await users.findByPk(userId);
  if (!foundUser) {
    throw new NotFoundError('User not found', 'userId');
  }

  if (foundUser.status !== 'pending') {
    throw new BadRequestError('User is already onBoarded');
  } else {
    const updatedResponse = await users.update(
      {
        status: 'active',
      },
      {
        where: { id: userId },
        individualHooks: true,
        userObj: {
          name: currentUser.name,
          userId: currentUser.userId,
        },
      }
    );

    return updatedResponse;
  }
};

// get count of users with pending status for given branch Ids.
const getPendingUsersCount = async (branchIds) => {
  let whereConditions = {
    status: userStatus.pending,
  };
  if (branchIds)
    whereConditions = { ...whereConditions, branch_id: { [Op.in]: branchIds } };
  const usersCount = await users.count({
    where: whereConditions,
    logging: false,
  });
  return usersCount;
};

// getUserRoleByEmail method is used for fetching userRole from users table using respected user's email id.
const getUserRoleByEmail = async (email) => {
  email = email.trim().toLowerCase();

  // fetching role id of user whose email is same as email parameter from users table.
  const userRoleIdResponse = await users.findOne({
    where: {
      company_email: Sequelize.where(
        Sequelize.fn('LOWER', Sequelize.col('company_email')),
        '=',
        email
      ),
    },
    attributes: ['role_id'],
    logging: false,
  });
  // throw error if roleId not found.
  if (!userRoleIdResponse) {
    throw new UnauthorizedRequestError(errorMessage.statusCode401);
  }

  // fetching role using PK role id from userRoles table
  const userRoleResponse = await userRoles.findByPk(
    userRoleIdResponse.dataValues.role_id,
    {
      attributes: ['role'],
      logging: false,
    }
  );
  // throw error if role nor found for roleID.
  if (!userRoleResponse) {
    throw new BadRequestError(errorMessage.statusCode400);
  }

  //return role of user.
  return userRoleResponse.dataValues.role;
};

// getUserSoftwares() method is used to fetch list of software assigned to user.
const getUserSoftwares = async ({ userId }) => {
  //if userId not provided properly.
  if (!userId)
    throw new ValidationError('Please provide valid user id.', 'userId');

  // fetching user based on userId PK from users table.
  const userInstance = await users.findByPk(userId);
  if (!userInstance) {
    throw new NotFoundError(
      `User with id ${userId} Not Found in database.`,
      'userId'
    );
  }

  // find all softwares mapped with user with provided userId.
  let userSoftwareResponse = await userSoftwareMapping.findAll({
    where: {
      user_id: userId,
    },
    attributes: [
      'id',
      'status',
      'note',
      'assign_date',
      'username',
      'last_email_date',
    ],
    logging: false,
    include: [
      {
        model: software,
        attributes: ['id', 'icon', 'name'],
        include: [
          {
            model: clients,
            attributes: ['id', 'name'],
          },
          {
            model: softwareManagers,
            as: 'SoftwareAlias',
            attributes: ['manager_id'],
          },
        ],
      },
    ],
  });
  // remove softwareAlice field from response and add managed_by field which contains array of manager Ids.
  userSoftwareResponse = userSoftwareResponse.map((userSoftwareObject) => {
    const managersArray = userSoftwareObject.Software.SoftwareAlias.map(
      (managerObject) => managerObject.manager_id
    );
    userSoftwareObject.Software.dataValues.managed_by = managersArray;
    delete userSoftwareObject.dataValues.Software.dataValues.SoftwareAlias;
    return userSoftwareObject;
  });
  return userSoftwareResponse;
};

//get all user with provide filters and serachText
const getUsers = async ({
  searchText = '',
  location,
  status,
  workAllocation = 0,
  orderBy = 'createdAt',
  order = 'DESC',
  resultsPerPage = Number.MAX_SAFE_INTEGER,
  page = 1,
  role,
}) => {
  page = parseInt(page);
  resultsPerPage = parseInt(resultsPerPage);
  workAllocation = parseInt(workAllocation);
  page = page < 0 ? 1 : page;
  status = status?.trim().toLowerCase();
  location = location?.trim().toLowerCase();
  searchText = searchText?.trim();

  if (role) {
    role = role.map((data) => data.toLowerCase().trim());
  }

  const user = await users.findAll({
    attributes: getUsersStrings.requiredAttribute,
    include: [
      {
        model: branches,
        attributes: [['name', 'branch_name']],
        where: {
          name: Sequelize.where(
            Sequelize.fn('LOWER', Sequelize.col('name')),
            'LIKE',
            location || { [Op.ne]: null }
          ),
        },
      },
      {
        model: skills,
        attributes: ['id', 'name'],
        through: { attributes: [] },
      },
      {
        model: userRoles,
        attributes: ['id', 'role'],
        where: {
          role: role ? { [Op.in]: role } : { [Op.iLike]: '%' },
        },
      },
    ],
    where: {
      [Op.and]: [
        {
          status: status || { [Op.ne]: null },
          capacity: workAllocation
            ? { [Op.lte]: workAllocation }
            : { [Op.or]: [{ [Op.gte]: 0 }, { [Op.eq]: null }] },
        },
        {
          [Op.or]: [
            {
              first_name: {
                [Op.iLike]: `%${searchText}%`,
              },
            },
            {
              last_name: {
                [Op.iLike]: `%${searchText}%`,
              },
            },
            {
              employee_id: {
                [Op.iLike]: `%${searchText}%`,
              },
            },
            {
              job_title: {
                [Op.iLike]: `%${searchText}%`,
              },
            },
            Sequelize.literal(
              `CONCAT(first_name, ' ', last_name) ILIKE '%${searchText}%'`
            ),
          ],
        },
      ],
    },
    order: [[orderBy, order]],
    offset: (page - 1) * resultsPerPage,
    limit: resultsPerPage,
  });

  let totalResults = user.length;
  if (user[0] && resultsPerPage !== Number.MAX_SAFE_INTEGER) {
    totalResults = await users.count({
      include: [
        {
          model: branches,
          where: {
            name: Sequelize.where(
              Sequelize.fn('LOWER', Sequelize.col('name')),
              'LIKE',
              location || { [Op.ne]: null }
            ),
          },
        },
        {
          model: userRoles,
          attributes: ['id', 'role'],
          where: {
            role: role ? { [Op.in]: role } : { [Op.iLike]: '%' },
          },
        },
      ],
      where: {
        [Op.and]: [
          {
            status: status || { [Op.ne]: null },
            capacity: workAllocation
              ? { [Op.lte]: workAllocation }
              : { [Op.or]: [{ [Op.gte]: 0 }, { [Op.eq]: null }] },
          },
          {
            [Op.or]: [
              {
                first_name: {
                  [Op.iLike]: `%${searchText}%`,
                },
              },
              {
                last_name: {
                  [Op.iLike]: `%${searchText}%`,
                },
              },
              {
                employee_id: {
                  [Op.iLike]: `%${searchText}%`,
                },
              },
              {
                job_title: {
                  [Op.iLike]: `%${searchText}%`,
                },
              },
              Sequelize.literal(
                `CONCAT(first_name, ' ', last_name) ILIKE '%${searchText}%'`
              ),
            ],
          },
        ],
      },
    });
  }
  const currentPage = page;
  const totalPages = Math.ceil(totalResults / resultsPerPage);

  return { user, currentPage, totalResults, totalPages };
};

//get user by id
const getUserById = async (userId) => {
  const user = await users.findByPk(userId, {
    attributes: {
      exclude: [
        'department_id',
        'agency_id',
        'manager_id',
        'createdAt',
        'updatedAt',
        'deletedAt',
        'deletedBy',
        'createdBy',
        'updatedBy',
      ],
    },
    include: [
      {
        model: branches,
        attributes: ['name', 'id', 'prefix'],
      },
      { model: departments, attributes: ['name'] },
      {
        model: agencies,
        attributes: ['email', 'agency_name'],
      },
      {
        model: users,
        as: 'Manager',
        attributes: ['first_name', 'last_name'],
        required: false,
      },
      {
        model: userRoles,
        attributes: ['id', 'role'],
      },
    ],
  });

  if (!user) {
    throw new NotFoundError(`User not found`, 'userId');
  }

  return user;
};

const addUser = async (data, userEmail, userObj) => {
  let agency;
  if (data.agency_email) {
    const [agencyData, isCreated] = await agencies.findOrCreate({
      where: {
        email: data.agency_email,
      },
      defaults: {
        agency_name: data.agency_name,
        createdBy: userEmail,
        updatedBy: userEmail,
      },
    });

    if (!isCreated && data?.agency_name !== agencyData?.agency_name) {
      agencyData.agency_name = data.agency_name;
      agencyData.updatedBy = userEmail;
      await agencyData.save();
    }
    agency = agencyData;
  }
  let userData = { ...data };

  userData = {
    ...userData,
    agency_id: agency?.id,
    createdBy: userEmail,
    updatedBy: userEmail,
  };

  if (!userData.status) {
    userData.status = 'pending';
  }

  // assigning employee as a default role to the user
  userData.role_id = roles.employeeRole;

  try {
    const newUser = await users.create(userData, { userObj });
    return newUser;
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      throw new BadRequestError(error.errors[0].message, error.errors[0].path);
    }
    let errorField;
    if (error.fields) errorField = Object.keys(error.fields)[0];
    throw new BadRequestError(error?.parent?.message, errorField);
  }
};

// update user
const updateUser = async (userId, data, userEmail, userObj) => {
  if (Object.keys(data).length === 0) {
  }
  let user = await users.findByPk(userId, {
    raw: true,
  });
  if (!user) throw new NotFoundError(`User Not Found `, 'userId');

  let agency;
  if (data.agency_email) {
    const [agencyData, isCreated] = await agencies.findOrCreate({
      where: {
        email: data.agency_email,
      },
      defaults: {
        agency_name: data.agency_name,
        createdBy: userEmail,
        updatedBy: userEmail,
      },
    });

    if (!isCreated && data?.agency_name !== agencyData?.agency_name) {
      agencyData.agency_name = data.agency_name;
      agencyData.updatedBy = userEmail;
      await agencyData.save();
    }
    agency = agencyData;
  }
  let updateData = { ...data };

  if (updateData.role_id && userObj.role !== roles.ownerRole) {
    throw new BadRequestError('you are unauthorized to change role', 'role');
  }

  if (data.end_date && user.status === 'active') {
    updateData.status;
  }
  updateData = {
    ...updateData,
    agency_id: agency?.id === undefined ? null : agency?.id,
    updated_by: userEmail,
    branch_id: data.branch_id,
  };
  try {
    const [numOfRows, response] = await users.update(updateData, {
      attributes: {
        exclude: [
          'createdAt',
          'updatedAt',
          'deletedAt',
          'deletedBy',
          'createdBy',
          'updatedBy',
        ],
      },
      where: {
        id: userId,
      },
      individualHooks: true,
      userObj,
      returning: true,
    });
    const includedBranch = await branches.findOne({
      raw: true,
      where: {
        id: response[0].dataValues.branch_id,
      },
    });
    if (data.agency_email) {
      return {
        ...response[0].dataValues,
        Agency: {
          agency_name: agency.agency_name,
          email: agency.email,
        },
        Branch: {
          id: includedBranch.id,
          name: includedBranch.name,
        },
      };
    }

    return {
      ...response[0].dataValues,
      Branch: {
        id: includedBranch.id,
        name: includedBranch.name,
      },
    };
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      throw new BadRequestError(error.errors[0].message, error.errors[0].path);
    }
    let errorField;
    if (error.fields) errorField = Object.keys(error.fields)[0];
    throw new BadRequestError(error?.parent?.message, errorField);
  }
};

const deleteUser = async (userId, userEmail) => {
  const user = await users.findByPk(userId);

  if (!user) {
    throw new NotFoundError(`User Not Found`, 'userId');
  }
  user.deletedAt = Date.now();
  user.deletedBy = userEmail;
  await user.save();

  return user.id;
};

const getUserHistoryById = async ({ userId, limit }) => {
  const user = await users.findByPk(userId);
  if (!user) {
    throw new NotFoundError(`User Not Found`, 'userId');
  }
  const userHistory = await history.findAll({
    where: { user_id: userId },
    raw: true,
    order: [['timestamp', 'DESC']],
    limit,
  });

  return userHistory;
};

module.exports = {
  changeStatusByUserId,
  getPendingUsersCount,
  getUserRoleByEmail,
  getUsers,
  getUserById,
  addUser,
  updateUser,
  deleteUser,
  getUserHistoryById,
  getUserSoftwares,
  addMultipleUser,
};
