const moment = require('moment');
const model = require('../../database/models');
const { userSoftwareStatus } = require('../../utils/strings');
const {
  revokeSoftwareEmail,
  assignSoftwareEmail,
} = require('../../utils/helpers/emailHelper');

const UserSoftwares = model.UserSoftwares;
const Software = model.Softwares;
const User = model.Users;
const timegGapInHour = process.env.TIME_BETWEEN_MAILS || 24;

const sendRevokeSoftwareMail = async (req, { userSoftwareIds }) => {
  let success = [];
  let warning = [];
  let error = [];

  await Promise.all(
    userSoftwareIds.map(async (userSoftwareId) => {
      //user software information
      const userSoftwareInstance = await UserSoftwares.findByPk(userSoftwareId);
      if (!userSoftwareInstance) {
        error.push({
          userSoftwareId,
          code: 404,
          type: 'NotFoundError',
          field: 'userSoftwareId',
          message: 'User Software not found.',
        });
        return;
      }

      //user information
      const userInstance = await User.findByPk(userSoftwareInstance.user_id, {
        attributes: ['first_name', 'last_name'],
      });

      if (!userInstance) {
        error.push({
          userSoftwareId,
          code: 404,
          type: 'NotFoundError',
          field: 'user_id',
          message: 'User not found.',
        });
        return;
      }

      //software information
      const softwareInstance = await Software.findByPk(
        userSoftwareInstance.software_id,
        {
          attributes: ['name', 'status'],
          include: [
            {
              model: User,
              as: 'Managers',
              attributes: ['company_email'],
              through: { attributes: [] },
              required: false,
            },
          ],
        }
      );

      if (!softwareInstance) {
        error.push({
          userSoftwareId,
          code: 404,
          type: 'NotFoundError',
          field: 'software_id',
          message: 'Software not found.',
        });
        return;
      }

      // check if software is already revoked
      if (userSoftwareInstance.status === userSoftwareStatus.revoked) {
        error.push({
          userSoftwareId,
          code: 400,
          type: 'BadRequestError',
          field: null,
          message: `${softwareInstance.name} already revoked.`,
        });
        return;
      }

      //check if the software is assgined or not
      if (userSoftwareInstance.status === userSoftwareStatus.pending) {
        error.push({
          userSoftwareId,
          code: 400,
          type: 'BadRequestError',
          field: null,
          message: `Can't revoke a software which is still not assigned.`,
        });
        return;
      }

      // check time of last mail and decide whether mails should be sent
      const needToSend =
        moment().diff(userSoftwareInstance.last_email_date, 'hours') >=
        timegGapInHour;

      if (!userSoftwareInstance.last_email_date || needToSend) {
        //filter emails of managers
        const managerEmails = softwareInstance.Managers.map(
          (user) => user.company_email
        ).filter((email) => email !== null);

        //send mail notification
        if (managerEmails.length) {
          revokeSoftwareEmail(req, {
            managers: managerEmails,
            softwareName: softwareInstance.name,
            employeeName: {
              firstname: userInstance.first_name,
              lastname: userInstance.last_name,
            },
            employeeId: userSoftwareInstance.user_id,
          }).then(async (mailSent) => {
            if (mailSent) {
              // update new time of last email sent
              userSoftwareInstance.last_email_date = new Date();
              await userSoftwareInstance.save();
            }
          });
        } else {
          error.push({
            userSoftwareId,
            code: 404,
            type: 'NotFoundError',
            field: 'manager_work_email',
            message: 'Manager work email not found.',
          });
          return;
        }

        success.push({
          userSoftwareId,
          message: 'Software revoke notification email sent successfully.',
          code: 200,
          last_email_date: moment(),
        });
      } else {
        const tryAfter = moment(userSoftwareInstance.last_email_date)
          .add(timegGapInHour, 'hours')
          .diff(moment(), 'hours');

        warning.push({
          userSoftwareId,
          code: 429,
          type: 'TooManyRequestsError',
          field: null,
          message: `Please try again after ${tryAfter} Hours for ${softwareInstance.name}.`,
        });
        return;
      }
    })
  );

  return { success, warning, error };
};

const sendAssignSoftwareMail = async (req, { userSoftwareIds }) => {
  let success = [];
  let warning = [];
  let error = [];

  await Promise.all(
    userSoftwareIds.map(async (userSoftwareId) => {
      //user software information
      const userSoftwareInstance = await UserSoftwares.findByPk(userSoftwareId);
      if (!userSoftwareInstance) {
        error.push({
          userSoftwareId,
          code: 404,
          type: 'NotFoundError',
          field: 'userSoftwareId',
          message: 'User Software not found.',
        });
        return;
      }

      //user information
      const userInstance = await User.findByPk(userSoftwareInstance.user_id, {
        attributes: ['first_name', 'last_name'],
      });

      if (!userInstance) {
        error.push({
          userSoftwareId,
          code: 404,
          type: 'NotFoundError',
          field: 'user_id',
          message: 'User not found.',
        });
        return;
      }

      //software information
      const softwareInstance = await Software.findByPk(
        userSoftwareInstance.software_id,
        {
          attributes: ['name', 'status'],
          include: [
            {
              model: User,
              as: 'Managers',
              attributes: ['company_email'],
              through: { attributes: [] },
              required: false,
            },
          ],
        }
      );

      if (!softwareInstance) {
        error.push({
          userSoftwareId,
          code: 404,
          type: 'NotFoundError',
          field: 'software_id',
          message: 'Software not found.',
        });
        return;
      }

      // check if software is already assigned
      if (userSoftwareInstance.status === userSoftwareStatus.active) {
        error.push({
          userSoftwareId,
          code: 400,
          type: 'BadRequestError',
          field: null,
          message: `${softwareInstance.name} already assigned.`,
        });
        return;
      }

      // check time of last mail and decide whether mails should be sent
      const needToSend =
        moment().diff(userSoftwareInstance.last_email_date, 'hours') >=
        timegGapInHour;

      if (!userSoftwareInstance.last_email_date || needToSend) {
        //filter emails of managers
        const managerEmails = softwareInstance.Managers.map(
          (user) => user.company_email
        ).filter((email) => email !== null);

        //send mail notification
        if (managerEmails.length) {
          assignSoftwareEmail(req, {
            managers: managerEmails,
            softwareName: softwareInstance.name,
            employeeName: {
              firstname: userInstance.first_name,
              lastname: userInstance.last_name,
            },
            employeeId: userSoftwareInstance.user_id,
          }).then(async (mailSent) => {
            if (mailSent) {
              // update new time of last email sent
              userSoftwareInstance.last_email_date = new Date();
              await userSoftwareInstance.save();
            }
          });
        } else {
          error.push({
            userSoftwareId,
            code: 404,
            type: 'NotFoundError',
            field: 'manager_work_email',
            message: 'Manager work email not found.',
          });
          return;
        }

        success.push({
          userSoftwareId,
          message: 'Assign software notification email sent successfully.',
          code: 200,
          last_email_date: moment(),
        });
      } else {
        const tryAfter = moment(userSoftwareInstance.last_email_date)
          .add(timegGapInHour, 'hours')
          .diff(moment(), 'hours');

        warning.push({
          userSoftwareId,
          code: 429,
          type: 'TooManyRequestsError',
          field: null,
          message: `Please try again after ${tryAfter} Hours for ${softwareInstance.name}.`,
        });
        return;
      }
    })
  );

  return { success, warning, error };
};
module.exports = { sendRevokeSoftwareMail, sendAssignSoftwareMail };
