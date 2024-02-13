const router = require('../router');
const getSoftware = require('../../controllers/software/getSoftwareById');
const deleteSoftware = require('../../controllers/software/deleteSoftware');
const { createSoftware } = require('../../controllers/software/createSoftware');
const {
  softwareEndpoints,
  softwareClientEndpoints,
} = require('../../utils/strings');
const getAllSoftwares = require('../../controllers/software/getAllSoftwares');
const validateData = require('../../middleware/validateData');
const {
  getSoftwareUsers,
} = require('../../controllers/software/getSoftwareUsers');
const { wrap } = require('../../utils/wrap');
const { updateSoftware } = require('../../controllers/software/updateSoftware');
const {
  softwareGetSchema,
  softwarePostSchema,
  softwareDeleteSchema,
  softwarePatchSchema,
  softwaresGetSchema,
} = require('../../utils/validationSchema/softwareSchema');
const getAllSoftwaresByClientId = require('../../controllers/software/getAllSoftwaresByClientId');
const {
  getAllClients,
} = require('../../controllers/software/getAllClients.controller');
router.get(
  softwareEndpoints.get,
  softwareGetSchema,
  validateData,
  wrap(getSoftware)
);

router.post(
  softwareEndpoints.post,
  softwarePostSchema,
  validateData,
  wrap(createSoftware)
);
router.patch(
  softwareEndpoints.patch,
  softwarePatchSchema,
  validateData,
  wrap(updateSoftware)
);

router.delete(
  softwareEndpoints.delete,
  softwareDeleteSchema,
  validateData,
  wrap(deleteSoftware)
);
router.get(
  softwareEndpoints.getAll,
  softwaresGetSchema,
  validateData,
  wrap(getAllSoftwares)
);

// user-software mapping routes
router.get(softwareEndpoints.getSoftwareUsers, wrap(getSoftwareUsers));

router.get(
  softwareEndpoints.getSoftwareByClientId,
  wrap(getAllSoftwaresByClientId)
);

router.get(softwareClientEndpoints.getAllClients, wrap(getAllClients));

module.exports = router;
