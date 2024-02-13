const softwareRepository = require('../../domain/software/softwareRepository');
const { NotFoundError } = require('../../utils/customException');
const errorMessage = require('../../utils/errorMessage');
const { success } = require('../../utils/responseGenerator');

const getAllSoftwares = async (req, res) => {
  const { status, order, orderBy, searchText, page, pageSize, clientName } =
    req.query;
  const response = await softwareRepository.getAllSoftwares({
    page,
    pageSize,
    status,
    clientName,
    order,
    orderBy,
    searchText,
  });

  res.status(200).json(
    success({
      message: errorMessage.statusCode200,
      data: [...response.softwares],
      statusCode: res.statusCode,
      metadata: {
        currentPage: response.currentPage,
        totalPages: response.totalPages,
        totalResults: response.totalResults,
      },
    })
  );
};

module.exports = getAllSoftwares;
