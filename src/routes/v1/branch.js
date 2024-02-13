const router = require('../router');

const { wrap } = require('../../utils/wrap');
const getBranches = require('../../controllers/branches/getBranches');

router.get('/branches', wrap(getBranches));

module.exports = router;
