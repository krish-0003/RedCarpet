const router = require('../router');
const {
  userEndpoints,
  rolesWithApproveEmployeeAccess,
} = require('../../utils/strings');
const getUsers = require('../../controllers/user/getUsers');
const deleteUser = require('../../controllers/user/deleteUser');
const getUserById = require('../../controllers/user/getUserById');
const updateUser = require('../../controllers/user/updateUser');
const addUser = require('../../controllers/user/addUser');
const addMultipleUser = require('../../controllers/user/addMultipleUsers');

const {
  userGetSchema,
  userByIdSchema,
  userAddSchema,
  userUpdateSchema,
  userSchemaForBulkCreate,
  userSchemaToAddUSEmployees,
} = require('../../utils/validationSchema/userSchema');
const {
  getUserHistoryById,
} = require('../../controllers/user/getUserHistoryById');
const { getUserSoftwares } = require('../../controllers/user/getUserSoftwares');
const validateData = require('../../middleware/validateData');
const {
  userHistorySchema,
} = require('../../utils/validationSchema/userSchema');
const changeStatus = require('../../controllers/user/aprroveEmployee');
const { wrap } = require('../../utils/wrap');
const checkRole = require('../../middleware/checkRoleMiddleware');
//users crud route
router.get(userEndpoints.getAll, userGetSchema, validateData, wrap(getUsers));
router.get(userEndpoints.get, userByIdSchema, validateData, wrap(getUserById));
router.post(userEndpoints.post, userAddSchema, validateData, wrap(addUser));
router.patch(
  userEndpoints.patch,
  userUpdateSchema,
  validateData,
  wrap(updateUser)
);
//Only remove comment if we add India employees
// router.post(
//   userEndpoints.multipleUsers,
//   userSchemaForBulkCreate,
//   validateData,
//   wrap(addMultipleUser)
// );
router.post(
  userEndpoints.multipleUsers,
  userSchemaToAddUSEmployees,
  validateData,
  wrap(addMultipleUser)
);
router.delete(
  userEndpoints.delete,
  userByIdSchema,
  validateData,
  wrap(deleteUser)
);
router.get(
  userEndpoints.getUserHistory,
  userHistorySchema,
  validateData,
  wrap(getUserHistoryById)
);

// user-software mapping routes
router.get(userEndpoints.getUserSoftwares, wrap(getUserSoftwares));

router.patch(
  '/users/:userId/approve',
  userByIdSchema,
  validateData,
  checkRole(rolesWithApproveEmployeeAccess),
  wrap(changeStatus)
);

module.exports = router;
