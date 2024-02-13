const { validationResult } = require('express-validator');
const { error } = require('../utils/responseGenerator');
const {
  expressValidatorErrorFormator,
} = require('../utils/expressValidatorErrorFormator');

const validateDataResult = (req, res, next) => {
  const err = validationResult(req);

  if (!err.isEmpty()) {
    res.status(400).json(error(expressValidatorErrorFormator(err.errors)));
    return;
  }
  next();
};

module.exports = [validateDataResult];
