const { body } = require('express-validator');

const loginShema = [body('code').isString()];

module.exports = { loginShema };
