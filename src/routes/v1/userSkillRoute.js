const router = require('../router');
const {
  addUserSkills,
} = require('../../controllers/user/addUserSkills.controller');
const {
  getUserSkills,
} = require('../../controllers/user/getUserSkills.controller');
const { wrap } = require('../../utils/wrap');
const validateData = require('../../middleware/validateData');
const {
  userSkillSchema,
  userByIdSchema,
  userSkillDeleteSchema,
} = require('../../utils/validationSchema/userSchema');
const { userEndpoints } = require('../../utils/strings');
const { allSkills } = require('../../controllers/user/allSkills.controller');
const {
  deleteUserSkills,
} = require('../../controllers/user/deleteUserSkills.controller');

//user skills routes
router.post(
  userEndpoints.skills,
  userByIdSchema,
  userSkillSchema,
  validateData,
  wrap(addUserSkills)
);

router.get(
  userEndpoints.skills,
  userByIdSchema,
  validateData,
  wrap(getUserSkills)
);

router.get(userEndpoints.allSkills, wrap(allSkills));

router.delete(
  userEndpoints.deleteUserSkills,
  userSkillDeleteSchema,
  validateData,
  wrap(deleteUserSkills)
);

module.exports = router;
