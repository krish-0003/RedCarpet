const { body, param, query, oneOf } = require('express-validator');
const { softwareStatus } = require('../strings');

const softwarePostSchema = [
  body('id').isInt().optional(),
  body('client_id').isInt().optional({ nullable: true }),
  body('client_name').isString(),
  body('name').isString(),
  body('status').isIn(['active', 'inactive']),
  body('url').isURL(),
  oneOf([body('icon').isURL().optional(), body('icon').isEmpty().optional()]),
  body('description').optional().isString(),
  body('managed_by').isArray().isLength({ min: 1 }),
  body('managed_by.*').isInt(),
];

const softwareGetSchema = [param('softwareId').isInt()];
const softwareDeleteSchema = [param('softwareId').isInt().optional()];
const softwaresGetSchema = [
  query('status').optional().isIn(Object.values(softwareStatus)),
];
const softwarePatchSchema = [
  param('softwareId').isInt(),
  body('id').isInt().optional(),
  body('name').isString().optional(),
  body('client_id').isInt().optional({ nullable: true }),
  body('client_name').isString().optional(),
  body('status').isIn(['active', 'inactive']).optional(),
  body('url').isURL().optional(),
  oneOf([body('icon').isURL().optional(), body('icon').isEmpty().optional()]),
  body('description').optional().isString(),
  body('managed_by').isArray().isLength({ min: 1 }).optional(),
  body('managed_by.*').isInt().optional(),
];

module.exports = {
  softwareGetSchema,
  softwarePostSchema,
  softwareDeleteSchema,
  softwarePatchSchema,
  softwaresGetSchema,
};
