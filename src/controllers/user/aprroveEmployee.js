const userRepository = require('../../domain/user/userRepository');
const { success } = require('../../utils/responseGenerator');
const changeStatus = async (req, res) => {
  const response = await userRepository.changeStatusByUserId(
    req.params.userId,
    req.user
  );
  if (!response) {
    throw new InternalServerError();
  }
  res
    .status(200)
    .json(success({ message: 'User approved successfully', statusCode: 200 }));
};

module.exports = changeStatus;
