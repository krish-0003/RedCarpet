const { userEndpoints } = require('../../utils/strings');
const { wrap } = require('../../utils/wrap');
const express = require('express');
const router = express.Router();
const { login, logout, refreshToken } = require('../../controllers/authUser');
const { loginShema } = require('../../utils/validationSchema/loginSchema');
const validateData = require('../../middleware/validateData');
const { refreshTokenMiddleware } = require('../../middleware/authMiddleware');

//login route
router.post(userEndpoints.login, loginShema, validateData, wrap(login));

//new access token from refresh token
router.get(
  userEndpoints.refreshToken,
  refreshTokenMiddleware,
  wrap(refreshToken)
);

//logout route
router.delete(userEndpoints.logout, wrap(logout));

module.exports = router;
