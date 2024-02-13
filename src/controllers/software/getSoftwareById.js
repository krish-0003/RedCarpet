const softwareRepository = require('../../domain/software/softwareRepository');
const {
  ValidationError,
  NotFoundError,
} = require('../../utils/customException');
const errorMessage = require('../../utils/errorMessage');
const { success } = require('../../utils/responseGenerator');

const getSoftware = async (req, res) => {
  const response = await softwareRepository.getSoftwareById(
    req.params.softwareId
  );

  return res.status(200).json(
    success({
      message: errorMessage.statusCode200,
      data: response,
      statusCode: res.statusCode,
    })
  );
};

module.exports = getSoftware;
