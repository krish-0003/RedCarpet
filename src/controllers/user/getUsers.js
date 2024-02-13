const userRepository = require('../../domain/user/userRepository');
const { success } = require('../../utils/responseGenerator');
const getUsers = async (req, res) => {
  const {
    searchText,
    location,
    status,
    orderBy,
    order,
    role,
    resultsPerPage,
    page,
    workAllocation,
  } = req.query;

  const response = await userRepository.getUsers({
    searchText,
    location,
    status,
    workAllocation,
    orderBy,
    order,
    role,
    resultsPerPage,
    page,
  });

  res.status(200).json(
    success({
      message: 'success',
      data: response.user,
      statusCode: 200,
      metadata: {
        currentPage: response.currentPage,
        totalPages: response.totalPages,
        totalResults: response.totalResults,
      },
    })
  );
};

module.exports = getUsers;
