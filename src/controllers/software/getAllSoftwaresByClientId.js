const softwareRepository = require('../../domain/software/softwareRepository');
const { NotFoundError } = require('../../utils/customException');
const errorMessage = require('../../utils/errorMessage');
const { success } = require('../../utils/responseGenerator');

const getAllSoftwaresByClientId = async (req, res) => {
  const response = await softwareRepository.getSoftwaresByClient(
    req.params.clientId
  );

  res.status(200).json(
    success({
      message: errorMessage.statusCode200,
      data: response,
      statusCode: res.statusCode,
      metadata: {
        currentpage: response.currentPage,
        totalPages: response.totalPages,
        totalResults: response.totalResults,
      },
    })
  );
};

module.exports = getAllSoftwaresByClientId;
