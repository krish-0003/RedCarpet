const { error } = require('../utils/responseGenerator');

const errorHandler = (err, request, response, next) => {
  request.log.error(err);
  return response.status(err?.code || err[0]?.code || 500).json(error(err));
};

module.exports = errorHandler;
