const {
  getSoftwareUsers,
} = require('../../domain/software/softwareRepository');
const { success } = require('../../utils/responseGenerator');

// getSoftwareUsers() controller fetches list of users mapped with software having provided softwareId.
module.exports.getSoftwareUsers = async (req, res) => {
  // get softwareId from params.
  const softwareId = parseInt(req.params.softwareId);

  // perform database action.
  const response = await getSoftwareUsers({
    softwareId,
  });

  res.status(200).json(
    success({
      message: 'List of assigned software to User.',
      data: response,
      statusCode: 200,
    })
  );
};
