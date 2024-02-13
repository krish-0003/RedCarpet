const {
  deleteUserSoftwares,
} = require('../../domain/userSoftware/userSoftwareRepository');
const { success } = require('../../utils/responseGenerator');

module.exports.deleteUserSoftwares = async (req, res) => {
  const response = await deleteUserSoftwares(
    req.body.userSoftwareIds,
    req.user.email
  );

  // if no software deleted, then send 400 response.
  if (response && response.error.length === req.body.userSoftwareIds.length)
    res.status(400).json(
      success({
        message: 'No Softwares deleted.',
        data: response,
        statusCode: 400,
        error: true,
      })
    );
  else
    res.status(202).json(
      success({
        message: 'Software deleted successfully.',
        data: response,
        statusCode: 202,
        error: false,
      })
    );
};
