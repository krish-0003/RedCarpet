const { body, param, query } = require('express-validator');
const { userStatus, userEmployementType, systemRoles } = require('../strings');

const userAddSchema = [
  body('employee_id').isString().optional({ nullable: true }),
  body('first_name').isString(),
  body('last_name').isString(),
  body('company_email')
    .matches(/^[^\s@]+@techholding\.co$/)
    .optional(),
  body('personal_email')
    .isEmail()
    .not()
    .matches(/^[^\s@]+@techholding\.co$/),
  body('country_code').isString(),
  body('phone_number')
    .isInt()
    .optional()
    .isLength({ min: 10, max: 15 })
    .withMessage('Minimum 10 digits required'),
  body('branch_id').isInt(),
  body('address').isString(),
  body('city').isString(),
  body('status').isIn(Object.values(userStatus)).optional(),
  body('state').isString(),
  body('zipcode')
    .if(body('zipcode').notEmpty())
    .isAlphanumeric()
    .isLength({ min: 3, max: 8 })
    .withMessage('Invalid Zipcode'),
  body('job_title').isString(),
  body('employment_type').isIn(Object.values(userEmployementType)),
  body('agency_name').if(body('agency_email').notEmpty()).isString(),
  body('agency_email').if(body('agency_name').notEmpty()).isEmail(),
  body('join_date').isDate(),
  body('end_date').isDate().optional(),
  body('capacity').isInt({ min: 0, max: 40 }).optional(),
  body('note').optional(),
  body('manager_id').optional().isInt(),
  body('department_id').optional().isInt(),
];

const userUpdateSchema = [
  param('userId').isInt(),
  body('employee_id').isString().optional({ nullable: true }),
  body('first_name').isString().optional(),
  body('last_name').isString().optional(),
  body('company_email')
    .matches(/^[^\s@]+@techholding\.co$/)
    .optional({ nullable: true }),
  body('personal_email')
    .optional()
    .isEmail()
    .not()
    .matches(/^[^\s@]+@techholding\.co$/),

  body('country_code').isString().optional(),
  body('phone_number')
    .isInt()
    .isLength({ min: 10, max: 15 })
    .optional()
    .withMessage('Minimum 10 digits required'),
  body('branch_id').isInt().optional(),
  body('address').isString().optional({ nullable: true }),
  body('city').isString().optional({ nullable: true }),
  body('status').isIn(Object.values(userStatus)).optional(),
  body('state').isString().optional({ nullable: true }),
  body('zipcode')
    .if(body('zipcode').notEmpty())
    .isAlphanumeric()
    .isLength({ min: 3, max: 8 })
    .optional()
    .withMessage('Invalid Zipcode'),
  body('job_title').isString().optional(),
  body('employment_type').isIn(Object.values(userEmployementType)).optional(),
  body('agency_name').if(body('agency_email').notEmpty()).isString(),
  body('agency_email').if(body('agency_name').notEmpty()).isEmail(),
  body('join_date').isDate().optional(),
  body('end_date').isDate().optional(),
  body('capacity').isInt({ min: 0, max: 40 }).optional({ nullable: true }),
  body('role_id').isInt().optional(),
  body('note').optional(),
  body('manager_id')
    .custom((value, { req }) => {
      if (parseInt(value) === parseInt(req.params.userId)) {
        throw new Error('userId and managerId cannot be the same.');
      }
      return true;
    })
    .isInt()
    .optional(),
  body('department_id').isInt().optional(),
];

const userGetSchema = [
  query('status').optional().isIn(Object.values(userStatus)),
  query('serachText').isString().optional(),
  query('location').isString().optional(),
  query('orderBy').isString().optional(),
  query('order').isIn(['ASC', 'DESC', 'asc', 'desc']).optional(),
  query('workAllocation').isInt().optional(),
  query('role')
    .isArray()
    .optional()
    .custom((role) => {
      value = role.map((data) => {
        data = data.toLowerCase().trim();
        if (!Object.values(systemRoles).includes(data)) {
          throw new Error('Provide valid Role');
        }
      });
      return true;
    }),

  query('page').isInt().optional(),
  query('resultsPerPage').isInt().optional(),
];

const userByIdSchema = [param('userId').isInt()];
const userHistorySchema = [param('userId').isInt()];

const userSkillSchema = [body('skills').isArray(), body('skills.*').isString()];
const userSkillDeleteSchema = [
  param('userId').isInt(),
  body('skills')
    .isArray()
    .isLength({ min: 1 })
    .withMessage('Minimum one skill require'),
  body('skills.*').isInt().withMessage('skill must be numeric'),
];

const userSchemaForBulkCreate = [
  body('*.employee_id').isString().optional(),
  body('*.first_name').isString(),
  body('*.last_name').isAlpha(),
  body('*.company_email')
    .matches(/^[^\s@]+@techholding\.co$/)
    .optional(),
  body('*.personal_email')
    .isEmail()
    .not()
    .matches(/^[^\s@]+@techholding\.co$/)
    .optional({
      nullable: true,
    }),
  body('*.country_code').isString(),
  body('*.phone_number')
    .isInt()
    .optional()
    .isLength({ min: 10, max: 15 })
    .withMessage('Minimum 10 digits required'),
  body('*.branch_id').isInt(),
  body('*.address').isString().optional({ nullable: true }),
  body('*.city').isString().optional({
    nullable: true,
  }),
  body('*.status').isIn(Object.values(userStatus)).optional(),
  body('*.state').isString().optional({
    nullable: true,
  }),
  body('*.zipcode')
    .isAlphanumeric()
    .isLength({ min: 3, max: 8 })
    .withMessage('Invalid Zipcode')
    .optional({
      nullable: true,
    }),
  body('*.job_title').isString(),
  body('*.employment_type').isIn(Object.values(userEmployementType)),
  body('*.agency_name').if(body('agency_email').notEmpty()).isString(),
  body('*.agency_email').if(body('agency_name').notEmpty()).isEmail(),
  body('*.join_date').isDate(),
  body('*.end_date').isDate().optional(),
  body('*.capacity').isInt({ min: 0, max: 40 }).optional(),
  body('*.role_id').isInt().optional(),
  body('*.note').optional(),
  body('*.manager_id').optional().isInt(),
  body('*.department_id').optional().isInt(),
];

const userSchemaToAddUSEmployees = [
  body('*.employee_id').isString().optional(),
  body('*.first_name').isString(),
  body('*.last_name').isAlpha(),
  body('*.company_email')
    .matches(/^[^\s@]+@techholding\.co$/)
    .optional(),
  body('*.personal_email')
    .isEmail()
    .not()
    .matches(/^[^\s@]+@techholding\.co$/)
    .optional({
      nullable: true,
    }),
  body('*.country_code').isString().optional({
    nullable: true,
  }),
  body('*.phone_number')
    .isInt()
    .optional({ nullable: true })
    .isLength({ min: 10, max: 15 })
    .withMessage('Minimum 10 digits required'),
  body('*.branch_id').isInt(),
  body('*.address').isString().optional({ nullable: true }),
  body('*.city').isString().optional({
    nullable: true,
  }),
  body('*.status').isIn(Object.values(userStatus)).optional(),
  body('*.state').isString().optional({
    nullable: true,
  }),
  body('*.zipcode')
    .isAlphanumeric()
    .isLength({ min: 3, max: 8 })
    .withMessage('Invalid Zipcode')
    .optional({
      nullable: true,
    }),
  body('*.job_title').isString().optional({ nullable: true }),
  body('*.employment_type')
    .isIn(Object.values(userEmployementType))
    .optional({ nullable: true }),
  body('*.agency_name').if(body('agency_email').notEmpty()).isString(),
  body('*.agency_email').if(body('agency_name').notEmpty()).isEmail(),
  body('*.join_date').isDate().optional({
    nullable: true,
  }),
  body('*.end_date').isDate().optional(),
  body('*.capacity').isInt({ min: 0, max: 40 }).optional(),
  body('*.role_id').isInt().optional(),
  body('*.note').optional(),
  body('*.manager_id').optional().isInt(),
  body('*.department_id').optional().isInt(),
];

module.exports = {
  userAddSchema,
  userUpdateSchema,
  userGetSchema,
  userByIdSchema,
  userHistorySchema,
  userSkillSchema,
  userSkillDeleteSchema,
  userSchemaForBulkCreate,
  userSchemaToAddUSEmployees,
};
