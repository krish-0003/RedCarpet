const { body, param } = require('express-validator');

const checkListPostSchema = [
  body('checklistId').isInt(),
  body('checklistValue').isBoolean(),
];

const checkListGetSchema = [param('userId').isInt()];

module.exports = {
  checkListGetSchema,
  checkListPostSchema,
};
