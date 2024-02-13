const {
  updateUserSoftwares,
} = require('../../domain/userSoftware/userSoftwareRepository');
const { success } = require('../../utils/responseGenerator');

// updateUserSoftwares() controller takes required values from request and updates user software mapping.
module.exports.updateUserSoftwares = async (req, res) => {
  const { username, note, status } = req.body;

  // perform update database query.
  const response = await updateUserSoftwares({
    currentUserEmail: req.user.email,
    currentUserId: req.user.userId,
    currentUserName: req.user.name,
    note,
    status,
    username,
    userSoftwareId: req.params.userSoftwareId,
  });
  res.status(201).json(
    success({
      message: `software updated in database successfully.`,
      data: response,
      statusCode: 200,
      error: false,
    })
  );
};
