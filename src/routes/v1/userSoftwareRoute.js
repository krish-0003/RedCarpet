const router = require('../router');
const { userSoftwareEndpoints } = require('../../utils/strings');
const { wrap } = require('../../utils/wrap');
const {
  addUserSoftwares,
} = require('../../controllers/userSoftware/addUserSoftwares');
const {
  updateUserSoftwares,
} = require('../../controllers/userSoftware/updateUserSoftwares');
const {
  userSoftwarePostSchema,
  userSoftwarePatchSchema,
  assignRevokeSoftwareEmailSchema,
  deleteUserSoftwareSchema,
} = require('../../utils/validationSchema/userSoftwaresSchema');
const validateData = require('../../middleware/validateData');
const {
  sendRevokeSoftwareMail,
  sendAssignSoftwareMail,
} = require('../../controllers/userSoftware/userSoftwareEmail');
const {
  deleteUserSoftwares,
} = require('../../controllers/userSoftware/deleteUserSoftware');

// user-software mapping routes
router.post(
  userSoftwareEndpoints.addUserSoftware,
  userSoftwarePostSchema,
  validateData,
  wrap(addUserSoftwares)
);
router.patch(
  userSoftwareEndpoints.updateUserSoftware,
  userSoftwarePatchSchema,
  validateData,
  wrap(updateUserSoftwares)
);

//send assign software mail notification route
router.post(
  userSoftwareEndpoints.assignSoftwareMail,
  assignRevokeSoftwareEmailSchema,
  validateData,
  wrap(sendAssignSoftwareMail)
);

//send revoke mail notification route
router.post(
  userSoftwareEndpoints.revokeSoftwareMail,
  assignRevokeSoftwareEmailSchema,
  validateData,
  wrap(sendRevokeSoftwareMail)
);

//delete user softwares
router.delete(
  userSoftwareEndpoints.deleteSoftware,
  deleteUserSoftwareSchema,
  validateData,
  wrap(deleteUserSoftwares)
);
module.exports = router;
