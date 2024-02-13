const userRepository = require('../../domain/user/userRepository');
const { InternalServerError } = require('../../utils/customException');
const { success } = require('../../utils/responseGenerator');

const addMultipleUser = async (req, res) => {
  const response = await userRepository.addMultipleUser(req.body, req.user);
  if (!response) {
    throw new InternalServerError();
  }

  res.status(201).json(
    success({
      message: 'Users added successfully',
      data: response,
      statusCode: 201,
    })
  );
};

module.exports = addMultipleUser;
