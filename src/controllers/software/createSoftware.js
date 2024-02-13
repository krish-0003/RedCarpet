const softwareRepository = require('../../domain/software/softwareRepository');
const { NotFoundError } = require('../../utils/customException');
const errorMessage = require('../../utils/errorMessage');
const { success } = require('../../utils/responseGenerator');

const createSoftware = async (req, res) => {
  const response = await softwareRepository.createSoftware(
    req.body,
    req.user.email
  );

  res.status(201).json(
    success({
      message: errorMessage.statusCode200,
      data: response,
      statusCode: res.statusCode,
    })
  );
};

module.exports = { createSoftware };
