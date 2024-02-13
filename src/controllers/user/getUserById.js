const userRepository = require('../../domain/user/userRepository');
const { success } = require('../../utils/responseGenerator');

const getUserById = async (req, res) => {
  const response = await userRepository.getUserById(req.params.userId);
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

module.exports = getUserById;
