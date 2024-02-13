const branchRepository = require('../../domain/branch/branchRepository');
const errorMessage = require('../../utils/errorMessage');
const { success } = require('../../utils/responseGenerator');

const getBranches = async (req, res) => {
  const response = await branchRepository.getAllBranches();
  res.status(200).json(
    success({
      message: errorMessage.statusCode200,
      data: response,
      statusCode: res.statusCode,
    })
  );
};

module.exports = getBranches;
