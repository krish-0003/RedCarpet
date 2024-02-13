const userRepository = require('../../domain/user/userRepository');
const { success } = require('../../utils/responseGenerator');
const updateUser = async (req, res) => {
  const response = await userRepository.updateUser(
    req.params.userId,
    req.body,
    req.user.email,
    req.user
  );
  if (!response) {
    throw new InternalServerError();
  }
  res.status(200).json(
    success({
      message: 'success',
      data: response,
      statusCode: 200,
    })
  );
};

module.exports = updateUser;
