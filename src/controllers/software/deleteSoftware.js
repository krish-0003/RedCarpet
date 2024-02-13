const softwareRepository = require('../../domain/software/softwareRepository');
const { NotFoundError } = require('../../utils/customException');
const errorMessage = require('../../utils/errorMessage');
const { success } = require('../../utils/responseGenerator');

const deleteSoftware = async (req, res) => {
  const response = await softwareRepository.deleteSoftware(
    req.params.softwareId,
    req.user.email
  );

  res.status(200).json(
    success({
      message: errorMessage.statusCode200,
      data: response,
      statusCode: res.statusCode,
    })
  );
};

module.exports = deleteSoftware;
