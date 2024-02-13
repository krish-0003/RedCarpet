const userRepository = require('../../domain/user/userRepository');
const {
  ValidationError,
  NotFoundError,
} = require('../../utils/customException');
const errorMessage = require('../../utils/errorMessage');
const { success } = require('../../utils/responseGenerator');

const getUserHistoryById = async (req, res) => {
  const response = await userRepository.getUserHistoryById({
    userId: req.params.userId,
    limit: req.query.limit || Number.MAX_SAFE_INTEGER,
  });

  return res.status(200).json(
    success({
      message: errorMessage.statusCode200,
      data: response,
      statusCode: res.statusCode,
      metadata: {
        totalResults: response.length,
      },
    })
  );
};

module.exports = { getUserHistoryById };
