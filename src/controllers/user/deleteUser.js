const userRepository = require('../../domain/user/userRepository');
const { InternalServerError } = require('../../utils/customException');
const { success } = require('../../utils/responseGenerator');

const deleteUser = async (req, res) => {
  const response = await userRepository.deleteUser(
    req.params.userId,
    req.user.email
  );

  if (!parseInt(response)) {
    throw new InternalServerError();
  }

  res.status(202).json(
    success({
      message: 'User Deleted Successfully',
      statusCode: 202,
    })
  );
};
module.exports = deleteUser;
