const userSoftwareEmailRepository = require('../../domain/userSoftware/userSoftwareEmail');
const { success } = require('../../utils/responseGenerator');

const sendRevokeSoftwareMail = async (req, res) => {
  const userSoftwareIds = req.body.userSoftwareIds;
  const sendMailResponse =
    await userSoftwareEmailRepository.sendRevokeSoftwareMail(req, {
      userSoftwareIds,
    });
  return res.status(200).json(
    success({
      message: 'Mail sent successfully.',
      data: sendMailResponse,
      statusCode: 200,
    })
  );
};

const sendAssignSoftwareMail = async (req, res) => {
  const userSoftwareIds = req.body.userSoftwareIds;
  const sendMailResponse =
    await userSoftwareEmailRepository.sendAssignSoftwareMail(req, {
      userSoftwareIds,
    });
  return res.status(200).json(
    success({
      message: 'Mail sent successfully.',
      data: sendMailResponse,
      statusCode: 200,
    })
  );
};

module.exports = { sendRevokeSoftwareMail, sendAssignSoftwareMail };
