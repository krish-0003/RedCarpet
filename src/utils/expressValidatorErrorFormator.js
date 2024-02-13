const errorMessage = require('./errorMessage');
module.exports.expressValidatorErrorFormator = (error) => {
  return error.map((err) => {
    return {
      code: 400,
      type: errorMessage.statusCode400,
      field: err.param,
      message: err.msg,
    };
  });
};
