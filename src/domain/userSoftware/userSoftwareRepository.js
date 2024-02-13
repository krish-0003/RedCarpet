const { Op } = require('sequelize');
const model = require('../../database/models');
const {
  NotFoundError,
  BadRequestError,
  UnauthorizedRequestError,
} = require('../../utils/customException');
const {
  userSoftwareStatus,
  softwareStatus,
  noteString,
} = require('../../utils/strings');
const { userStatus } = require('../../utils/strings');
const { assignSoftwareEmail } = require('../../utils/helpers/emailHelper');

// db models.
const user = model.Users;
const software = model.Softwares;
const userSoftwareMapping = model.UserSoftwares;
const softwareManagers = model.SoftwareManagers;

module.exports.addUserSoftwares = async (bulkData, req) => {
  let responseData;
  let errors = [];
  let mailsData = [];

  // fetching user based on user_id PK from users table.
  const userInstance = await user.findByPk(bulkData[0].user_id);
  if (!userInstance) {
    throw new NotFoundError('User not found.', 'user_id');
  }

  // if user is offboarding or offboarded status, software will not be assigned.
  if (
    userInstance.status === userStatus.offboarding ||
    userInstance.status === userStatus.offboarded
  ) {
    throw new BadRequestError(
      'Software cannot be assigned to offboarding or offboarded user.'
    );
  }

  await Promise.all(
    [...bulkData].map(async (data) => {
      // fetching software based on software_id PK from softwares table.
      const softwareInstance = await software.findByPk(data.software_id, {
        attributes: ['name', 'status'],
        include: [
          {
            model: user,
            as: 'Managers',
            attributes: ['company_email'],
            through: { attributes: [] },
            required: false,
          },
        ],
      });
      if (!softwareInstance || !data.software_id) {
        errors.push({
          errorType: 'SoftwareNotFound',
          software_id: data.software_id,
        });
        bulkData.splice(bulkData.indexOf(data), 1);
        return;
      }

      // if software is not active, throw error.
      if (softwareInstance.status != softwareStatus.active) {
        errors.push({
          errorType: 'SoftwareNotActive',
          software_id: data.software_id,
        });
        bulkData.splice(bulkData.indexOf(data), 1);
        return;
      }

      //check if software is already mapped with user.
      const userSoftwareObject = await userSoftwareMapping.findOne({
        where: {
          user_id: data.user_id,
          software_id: data.software_id,
          status: {
            [Op.or]: [userSoftwareStatus.pending, userSoftwareStatus.active],
          },
        },
      });

      // if status update requested for pending, throw Error.
      if (
        userSoftwareObject &&
        userSoftwareObject.status === userSoftwareStatus.pending
      ) {
        errors.push({
          errorType: 'SoftwareAlreadyRequested',
          software_id: data.software_id,
        });
        bulkData.splice(bulkData.indexOf(data), 1);
        return;
      }

      // if status update requested for active, throw Error.
      if (
        userSoftwareObject &&
        userSoftwareObject.status === userSoftwareStatus.active
      ) {
        errors.push({
          errorType: 'SoftwareAlreadyAssigned',
          software_id: data.software_id,
        });
        bulkData.splice(bulkData.indexOf(data), 1);
        return;
      }

      if (userInstance.status !== userStatus.pending) {
        //to add last email date for new software assignment
        data.last_email_date = new Date();
        //get array of software manager's emails and remove null values
        const managersEmailList = softwareInstance.Managers.map(
          (user) => user.company_email
        ).filter((email) => email !== null);

        if (managersEmailList.length) {
          mailsData.push({
            managers: managersEmailList,
            softwareName: softwareInstance.name,
          });
        }
      }
    })
  ).then(async (_) => {
    // add bulk data of software assignement in userSoftware table.
    responseData = await userSoftwareMapping.bulkCreate(bulkData, {
      returning: true,
      reqUserObj: {
        name: req.user?.name,
        userId: req.user?.userId,
      },
    });

    mailsData.map((data) => {
      assignSoftwareEmail(req, {
        ...data,
        employeeId: userInstance.id,
        employeeName: {
          firstname: userInstance.first_name,
          lastname: userInstance.last_name,
        },
      });
    });
  });
  return {
    error: errors,
    success: responseData,
  };
};

module.exports.updateUserSoftwares = async ({
  userSoftwareId,
  currentUserEmail,
  currentUserId,
  currentUserName,
  username,
  status,
  note,
}) => {
  // fetch userSoftware object using userSoftwareId PK.
  const userSoftwareObject = await userSoftwareMapping.findByPk(userSoftwareId);

  if (!userSoftwareObject || !userSoftwareId)
    throw new NotFoundError(
      'Could not find any entry for provided userSoftware id.'
    );
  // if current api call is not from manager of software, throw error.

  const softwareManagerObject = await softwareManagers.findOne({
    where: {
      software_id: userSoftwareObject.software_id,
      manager_id: currentUserId,
    },
  });

  if (!softwareManagerObject)
    throw new UnauthorizedRequestError(
      'only software manager can perform update.'
    );

  //if wrong status value requested, throw error.
  if (
    status !== userSoftwareStatus.active &&
    status !== userSoftwareStatus.pending &&
    status !== userSoftwareStatus.revoked
  )
    throw new BadRequestError(
      'Please provide valid software status.',
      'status'
    );

  // if same status update requested, throw Error.
  if (userSoftwareObject.status === status)
    throw new BadRequestError(
      `Software already has ${userSoftwareObject.status} status.`,
      'status'
    );

  // if status update requested againest the predefined flow, throw Error.
  if (
    (userSoftwareObject.status === userSoftwareStatus.active &&
      status === userSoftwareStatus.pending) ||
    (userSoftwareObject.status === userSoftwareStatus.revoked &&
      status === userSoftwareStatus.pending)
  )
    throw new BadRequestError(`Couldn't assign ${status} status.`, 'status');

  // if usename not provided while assigning sw, throw Error.
  if (status === userSoftwareStatus.active && !username)
    throw new Error('Please provide username for assignment.', 'username');

  // fetching user based on user_id PK from users table.
  const userInstance = await user.findByPk(userSoftwareObject.user_id);
  if (!userInstance) {
    throw new NotFoundError('User not found.', 'user_id');
  }

  // if user is offboarding or offboarded status, software will not be assigned.
  if (
    (userInstance.status === userStatus.offboarding ||
      userInstance.status === userStatus.offboarded) &&
    status === userSoftwareStatus.active
  ) {
    throw new BadRequestError(
      'Software cannot be assigned to offboarding or offboarded user.'
    );
  }

  if (userSoftwareObject) {
    const currentTimestamp = new Date();
    // update data in userSoftware table.
    const response = await userSoftwareMapping.update(
      {
        status: status || userSoftwareObject.status,
        note: note
          ? [
              {
                action:
                  status === userSoftwareStatus.active
                    ? noteString.assigned
                    : noteString.revoked,
                note,
                timestamp: currentTimestamp,
              },
              ...userSoftwareObject.note,
            ]
          : userSoftwareObject.note,
        username: username || userSoftwareObject.username,
        assign_date:
          status === userSoftwareStatus.active
            ? currentTimestamp
            : userSoftwareObject.assign_date,
        updatedBy: currentUserEmail,
        last_email_date: null,
      },
      {
        where: {
          id: userSoftwareId,
        },
        individualHooks: true,
        reqUserObj: {
          name: currentUserName,
          userId: currentUserId,
        },

        returning: true,
      }
    );
    if (status === userSoftwareStatus.revoked) {
      await softwareManagers.destroy({
        where: {
          software_id: userSoftwareObject.software_id,
          manager_id: userSoftwareObject.user_id,
        },
      });
    }
    return response[1][0];
  } else throw new BadRequestError('Something went wrong');
};

module.exports.deleteUserSoftwares = async (userSoftwareIds, userEmail) => {
  const error = [];
  const success = [];

  await Promise.all(
    userSoftwareIds.map(async (userSoftwareId) => {
      const userSoftware = await userSoftwareMapping.findByPk(userSoftwareId);
      if (!userSoftware) {
        error.push({
          errorType: 'UserSoftwareNotFound',
          id: userSoftwareId,
        });
      } else {
        userSoftware.deletedAt = Date.now();
        userSoftware.deletedBy = userEmail;

        await userSoftware.save();
        success.push({
          message: 'software deleted successfully',
          id: userSoftwareId,
        });
      }
    })
  );
  return { success, error };
};
