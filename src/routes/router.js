const express = require('express');
const router = express.Router();

// this is authentication middleware, which allows access to APIs with valid tokens only
const { authenticateUser } = require('../middleware/authMiddleware');

// //authentication middleware
router.use(authenticateUser);

module.exports = router;
