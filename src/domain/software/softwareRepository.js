const model = require('../../database/models');
const {
  NotFoundError,
  ValidationError,
  BadRequestError,
} = require('../../utils/customException');

const { Sequelize, Op } = require('sequelize');
const { userSoftwareStatus } = require('../../utils/strings');

const Software = model.Softwares;
const UserSoftwares = model.UserSoftwares;
const Users = model.Users;
const SoftwareManager = model.SoftwareManagers;
const Client = model.Clients;
const userSoftwareMapping = model.UserSoftwares;

const getSoftwareById = async (id) => {
  const response = await Software.findByPk(id, {
    attributes: {
      exclude: [
        'createdBy',
        'updatedBy',
        'deletedAt',
        'deletedBy',
        'client_id',
      ],
    },
    include: [
      {
        model: Users,
        as: 'Managers',
        attributes: [
          'id',
          'first_name',
          'last_name',
          'job_title',
          'company_email',
        ],
        through: {
          attributes: [],
        },
        required: false,
      },
      {
        model: Client,
        attributes: ['id', 'name'],
        required: false,
      },
    ],
    // raw: true,
  });
  if (!response) {
    throw new NotFoundError('Software not found');
  }
  return response;
};

const createOrUpdateClient = async (body, userEmail, transactionInstance) => {
  const [createClient, data] = await Client.findOrCreate({
    where: { id: body.client_id ? body.client_id : null },

    attributes: ['id', 'name'],
    defaults: body.client_name
      ? {
          name: body.client_name,
          createdBy: userEmail,
        }
      : {
          createdBy: userEmail,
        },
    transaction: transactionInstance,
  });
  return createClient;
};

const createSoftware = async (body, userEmail) => {
  const transactionInstance = await model.sequelize.transaction();
  try {
    const client = await createOrUpdateClient(
      body,
      userEmail,
      transactionInstance
    );
    let payload = body;
    payload = {
      ...payload,
      client_id: client.id,
      createdBy: userEmail,
      updatedBy: userEmail,
    };
    const response = await Software.create(payload, {
      transaction: transactionInstance,
    });
    response.dataValues.Client = {
      id: client.id,
      name: client.name,
    };

    const managersArray = [];
    for (const managerId of payload.managed_by) {
      const user = await Users.findByPk(managerId, {
        attributes: [
          'id',
          'first_name',
          'last_name',
          'job_title',
          'company_email',
        ],
      });
      if (!user)
        throw new NotFoundError(
          'Manager not found for managerId: ' + managerId
        );

      managersArray.push(user.dataValues);

      if (user) {
        await SoftwareManager.create(
          {
            software_id: response.id,
            manager_id: managerId,
          },
          { transaction: transactionInstance }
        );
        await userSoftwareMapping.create(
          {
            software_id: response.id,
            user_id: managerId,
            assign_date: new Date(),
            status: userSoftwareStatus.active,
            createdBy: userEmail,
            updatedBy: userEmail,
          },
          {
            transaction: transactionInstance,
          }
        );
      }
    }
    await transactionInstance.commit();
    delete response.dataValues.client_id;
    response.dataValues.Managers = managersArray;
    return response;
  } catch (error) {
    await transactionInstance.rollback();
    if (error.name === 'SequelizeUniqueConstraintError') {
      throw new BadRequestError(error.errors[0].message, error.errors[0].path);
    }
    throw error;
  }
};

const updateSoftware = async (id, body, userEmail) => {
  const transactionInstance = await model.sequelize.transaction();
  try {
    let payload = body;

    const softwareInstance = await Software.findByPk(id);
    if (!softwareInstance)
      throw new NotFoundError('Software not found', 'softwareId');

    if (!body.client_id && !body.client_name)
      body.client_id = softwareInstance.dataValues.client_id;
    const client = await createOrUpdateClient(
      body,
      userEmail,
      transactionInstance
    );
    payload = {
      ...payload,
      client_id: client.id,
      updatedAt: new Date(),
      updatedBy: userEmail,
    };

    const [rows, updatedSoftware] = await Software.update(payload, {
      where: { id },
      individualHooks: true,
      returning: true,
      raw: true,
      transaction: transactionInstance,
    });
    let response;
    if (updatedSoftware[0].dataValues) {
      response = updatedSoftware[0].dataValues;
    } else {
      response = updatedSoftware[0];
    }

    response.Client = {
      id: client.id,
      name: client.name,
    };
    const managersArray = [];
    const softwareManagers = await SoftwareManager.findAll({
      where: { software_id: id },
    });
    if (payload.managed_by) {
      for (const manager of softwareManagers) {
        if (!payload.managed_by.some((obj) => obj === manager.manager_id)) {
          await SoftwareManager.destroy({
            where: { software_id: id, manager_id: manager.manager_id },
            transaction: transactionInstance,
            returning: true,
          });
        } else {
          const user = await Users.findByPk(manager.manager_id, {
            attributes: [
              'id',
              'first_name',
              'last_name',
              'job_title',
              'company_email',
            ],
          });
          managersArray.push(user.dataValues);
        }
      }

      for (const managerId of payload.managed_by) {
        const user = await Users.findByPk(managerId, {
          attributes: [
            'id',
            'first_name',
            'last_name',
            'job_title',
            'company_email',
          ],
        });

        if (!user)
          throw new NotFoundError(
            'Manager not found for managerId: ' + managerId
          );
        if (!softwareManagers.some((obj) => obj.manager_id === managerId)) {
          managersArray.push(user.dataValues);
          await SoftwareManager.create(
            {
              software_id: id,
              manager_id: managerId,
            },
            { transaction: transactionInstance }
          );
          await userSoftwareMapping.findOrCreate({
            where: { software_id: id, user_id: managerId },
            defaults: {
              assign_date: new Date(),
              status: userSoftwareStatus.active,
              createdBy: userEmail,
              updatedBy: userEmail,
            },
            transaction: transactionInstance,
          });
        }
      }
    } else {
      for (const manager of softwareManagers) {
        const user = await Users.findByPk(manager.manager_id, {
          attributes: [
            'id',
            'first_name',
            'last_name',
            'job_title',
            'company_email',
          ],
        });

        if (!user)
          throw new NotFoundError(
            'Manager not found for managerId: ' + manager.manager_id
          );
        managersArray.push(user.dataValues);
      }
    }
    delete response.client_id;
    response.Managers = managersArray;
    await transactionInstance.commit();
    return response;
  } catch (error) {
    await transactionInstance.rollback();
    if (error.name === 'SequelizeUniqueConstraintError') {
      throw new BadRequestError(error.errors[0].message, error.errors[0].path);
    }
    throw error;
  }
};

const deleteSoftware = async (SoftwareId, userEmail) => {
  const [res1, res2] = await Promise.all([
    Software.update(
      {
        deletedBy: userEmail,
        deletedAt: new Date(),
      },
      { where: { id: SoftwareId } }
    ),
    UserSoftwares.update(
      {
        deletedBy: userEmail,
        deletedAt: new Date(),
      },
      { where: { software_id: SoftwareId } }
    ),
  ]);
  if (res1[0] === 0 && res2[0] === 0) {
    throw new NotFoundError('Software not found');
  }

  return 'Software Deleted';
};

const getAllSoftwares = async ({
  page = 1,
  pageSize = Number.MAX_SAFE_INTEGER,
  status,
  clientName,
  orderBy = 'createdAt',
  order = 'DESC',
  searchText = '',
}) => {
  status = status?.trim().toLowerCase();
  clientName = clientName?.trim().toLowerCase();

  const softwares = await Software.findAll({
    attributes: [
      'id',
      'name',
      'status',
      'icon',
      'createdAt',
      [
        model.Sequelize.fn('COUNT', model.Sequelize.col('UserSoftwares.id')),
        'allocations',
      ],
    ],
    include: [
      {
        model: UserSoftwares,
        attributes: [],
        required: false,
      },

      {
        model: Users,
        as: 'Managers',
        attributes: [
          'id',
          'first_name',
          'last_name',
          'job_title',
          'company_email',
        ],
        through: {
          attributes: [],
        },
        required: false,
      },
      {
        model: Client,
        attributes: ['id', 'name'],
        where: {
          name: Sequelize.where(
            Sequelize.fn('LOWER', Sequelize.col('Client.name')),
            'LIKE',
            clientName || { [Op.ne]: null }
          ),
        },
      },
    ],
    where: {
      [Op.and]: [
        {
          status: status || { [Op.ne]: null },
        },
        {
          [Op.or]: [
            {
              name: {
                [Op.iLike]: `%${searchText}%`,
              },
            },
          ],
        },
      ],
    },
    group: ['Softwares.id', 'Managers.id', 'Client.id'],

    order: [[orderBy, order]],
    offset: (page - 1) * pageSize,
    limit: pageSize,
    subQuery: false,
  });

  const currentPage = page;
  const totalResults = await Software.count();
  const totalPages = Math.ceil(totalResults / pageSize);

  return { softwares, totalPages, currentPage, totalResults };
};

// getSoftwareUsers() method is used to fetch list of Users using given software.
const getSoftwareUsers = async ({ softwareId }) => {
  // if software id not provided, throw error.
  if (!softwareId)
    throw new ValidationError(
      'Please provide valid software id.',
      'softwareId'
    );

  // fetching software based on softwareId PK from softwares table.
  const softwareInstance = await Software.findByPk(softwareId);
  if (!softwareInstance) {
    throw new NotFoundError(
      `Software with id ${softwareId} not found in database.`,
      'softwareId'
    );
  }

  // find all softwares mapped with user with provided userId.
  const userSoftwareResponse = await userSoftwareMapping.findAll({
    where: {
      software_id: softwareId,
    },
    attributes: ['id', 'status', 'note', 'assign_date'],
    logging: false,
    include: [
      {
        model: Users,
        attributes: ['id', 'first_name', 'last_name', 'job_title'],
      },
    ],
    order: [['assign_date', 'DESC']],
  });

  return userSoftwareResponse;
};

const getSoftwaresByClient = async (id) => {
  const response = await Software.findAll({
    where: {
      client_id: id,
    },
    attributes: [
      'id',
      'name',
      'client_id',
      'status',
      'url',
      'description',
      'icon',
    ],
    include: [
      {
        model: UserSoftwares,
        attributes: [],
        required: false,
      },

      {
        model: Users,
        as: 'Managers',
        attributes: [
          'id',
          'first_name',
          'last_name',
          'job_title',
          'company_email',
        ],
        through: {
          attributes: [],
        },
        required: false,
      },
      {
        model: Client,
        attributes: ['id', 'name'],
        required: false,
      },
    ],
  });
  return response;
};

const getAllClient = async () => {
  const clients = await Client.findAll({
    attributes: ['id', 'name'],
  });
  return clients;
};

module.exports = {
  getSoftwareById,
  createSoftware,
  deleteSoftware,
  getAllSoftwares,
  updateSoftware,
  getSoftwareUsers,
  getSoftwaresByClient,
  getAllClient,
};
