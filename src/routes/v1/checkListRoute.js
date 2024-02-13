const router = require('../router');
const { wrap } = require('../../utils/wrap');
const {
  markCheckListValue,
} = require('../../controllers/checkList/markCheckListValue.controller');
const {
  getCheckListValue,
} = require('../../controllers/checkList/getCheckListValue.controller');
const {
  checkListGetSchema,
  checkListPostSchema,
} = require('../../utils/validationSchema/checkListSchema');
const validateData = require('../../middleware/validateData');
const { checkListEndpoints } = require('../../utils/strings');

router.patch(
  checkListEndpoints.checklist,
  checkListGetSchema,
  checkListPostSchema,
  validateData,
  wrap(markCheckListValue)
);

router.get(
  checkListEndpoints.checklist,
  checkListGetSchema,
  validateData,
  wrap(getCheckListValue)
);

module.exports = router;
