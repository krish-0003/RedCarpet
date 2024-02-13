const { body, param } = require('express-validator');

const userSoftwarePostSchema = [
  param('userId').isInt().withMessage('please provide valid userId'),
  body('softwareList').isArray().withMessage('softwareList must be an array'),
  body('softwareList.*.software_id')
    .isInt()
    .withMessage('software_id must be an integer'),
  body('softwareList').custom((value) => {
    const uniqueIds = new Set(value.map((item) => item.software_id));
    if (uniqueIds.size !== value.length) {
      throw new Error('softwareList must contain only unique software_id');
    }
    return true;
  }),
];
const userSoftwarePatchSchema = [
  param('userSoftwareId')
    .isInt()
    .withMessage('please provide valid userSoftwareId'),
];

const assignRevokeSoftwareEmailSchema = [
  body('userSoftwareIds').custom((value, { req }) => {
    if (!value) {
      throw new Error('userSoftwareIds field is required');
    }
    if (!Array.isArray(value)) {
      throw new Error('userSoftwareIds must be an array');
    }
    if (value.length < 1) {
      throw new Error(
        'userSoftwareIds array must contain at least one element'
      );
    }
    if (!value.every((id) => Number.isInteger(id))) {
      throw new Error('userSoftwareIds array must contain only integer values');
    }
    return true;
  }),
];

const deleteUserSoftwareSchema = [
  body('userSoftwareIds')
    .isArray()
    .isLength({ min: 1 })
    .withMessage('Minimum one userSoftwareId require'),
  body('userSoftwareIds.*')
    .isInt()
    .withMessage('userSoftwareId must be numeric'),
];

module.exports = {
  userSoftwarePostSchema,
  userSoftwarePatchSchema,
  assignRevokeSoftwareEmailSchema,
  deleteUserSoftwareSchema,
};
