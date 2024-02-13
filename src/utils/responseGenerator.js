const errorMessage = require('./errorMessage');

module.exports.success = ({ message, data, statusCode, metadata, error }) => {
  return {
    data,
    message: message || errorMessage.statusCode200,
    error: error || false,
    code: statusCode || 200,
    metadata: {
      currentPage: metadata?.currentPage || 1,
      totalPages: metadata?.totalPages || 1,
      totalResults: metadata?.totalResults >= 0 ? metadata?.totalResults : 1,
    },
  };
};

module.exports.error = (err) => {
  if (err instanceof Array)
    return {
      errors: err.filter((errInstance) => {
        return {
          code: errInstance.code || 500,
          type: errInstance.name || errorMessage.error500,
          field: errInstance.field || null,
          message:
            errInstance.code === 500
              ? errorMessage.error500
              : errInstance.message || errorMessage.error500,
        };
      }),
    };
  else
    return {
      errors: [
        {
          code: err.code || 500,
          type: err.name || errorMessage.error500,
          field: err.field || null,
          message:
            err.code === 500
              ? errorMessage.error500
              : err.message || errorMessage.error500,
        },
      ],
    };
};
