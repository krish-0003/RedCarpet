const { OAuth2Client, UserRefreshClient } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const model = require('../database/models');
const moment = require('moment');
const { getUserInfoByToken } = require('../middleware/authMiddleware');
const {
  ForbiddenRequestError,
  UnauthorizedRequestError,
  InternalServerError,
} = require('../utils/customException');
const { success } = require('../utils/responseGenerator');
const verifyRole = require('../utils/roleAccess');
const { rolesWithloginAccess } = require('../utils/strings');

const expiryBufferTime =
  process.env.JWT_ACCESS_TOKEN_BUFFER_EXPIRY_TIME || '5m';
const accessTokenExpiry = process.env.JWT_ACCESS_TOKEN_EXPIRY || '1h';

const Tokens = model.Tokens;

const login = async (req, res) => {
  const googleClient = new OAuth2Client(
    process.env.GOOGLE_OAUTH_CLIENT_ID,
    process.env.GOOGLE_OAUTH_CLIENT_SECRET,
    'postmessage'
  );

  const { tokens } = await googleClient.getToken(req.body.code);

  const user = await getUserInfoByToken(tokens.access_token);
  if (!user) {
    throw new ForbiddenRequestError('Something went wrong');
  }
  const isAuthenticated = await verifyRole(rolesWithloginAccess, user.email);
  if (!isAuthenticated) {
    throw new UnauthorizedRequestError('User Not Authorized');
  }
  // create access token
  const accessToken = jwt.sign(user, process.env.JWT_ACCESS_TOKEN_KEY, {
    expiresIn: accessTokenExpiry,
  });

  const data = {
    user,
    accessToken,
    expiresAt: moment()
      .add(accessTokenExpiry.slice(0, -1), accessTokenExpiry.slice(-1))
      .subtract(expiryBufferTime.slice(0, -1), expiryBufferTime.slice(-1)),
  };

  // Create a new record to store refresh token of user
  // Or updated the exsiting record with the new refresh token if exists
  const [userTokens, isCreated] = await Tokens.findOrCreate({
    where: { user_id: user.userId },
    defaults: {
      refresh_token: tokens.refresh_token,
    },
  });

  // If already exists then update it
  if (!isCreated) {
    userTokens.refresh_token = tokens.refresh_token;
    await userTokens.save();
  }

  if (!userTokens) {
    throw new InternalServerError('Something went wrong');
  }

  return res
    .status(200)
    .json(success({ message: 'Login successful.', data, statusCode: 200 }));
};

const refreshToken = async (req, res) => {
  const token = req.headers['authorization'].split(' ')[1];
  const tokenPayload = jwt.decode(token);
  const userTokens = await Tokens.findOne({
    where: { user_id: tokenPayload.userId },
  });
  // if refresh token not found then throw forbidden request error
  if (!userTokens) {
    throw new ForbiddenRequestError('Login expired, Please Login again');
  }
  try {
    const refreshClient = new UserRefreshClient(
      process.env.GOOGLE_OAUTH_CLIENT_ID,
      process.env.GOOGLE_OAUTH_CLIENT_SECRET,
      userTokens.refresh_token
    );

    const { credentials } = await refreshClient.refreshAccessToken();
    const { access_token } = credentials;

    const user = await getUserInfoByToken(access_token);

    // failed to refresh the access token
    if (!user) {
      await Tokens.destroy({
        where: { user_id: tokenPayload.userId },
      });
      throw new ForbiddenRequestError('Something went wrong');
    }

    // create access token
    const accessToken = jwt.sign(user, process.env.JWT_ACCESS_TOKEN_KEY, {
      expiresIn: accessTokenExpiry,
    });

    const data = {
      user,
      accessToken,
      expiresAt: moment()
        .add(accessTokenExpiry.slice(0, -1), accessTokenExpiry.slice(-1))
        .subtract(expiryBufferTime.slice(0, -1), expiryBufferTime.slice(-1)),
    };

    return res
      .status(200)
      .json(success({ message: 'Access refreshed.', data, statusCode: 200 }));
  } catch (err) {
    await Tokens.destroy({
      where: { user_id: tokenPayload.userId },
    });
    throw new ForbiddenRequestError('Login expired, Please Login again');
  }
};

const logout = async (req, res) => {
  const token = req.headers['authorization'].split(' ')[1];
  const tokenPayload = jwt.decode(token);
  await Tokens.destroy({
    where: { user_id: tokenPayload.userId },
  });
  return res.status(200).json({
    message: 'User logged out successfully',
    error: false,
  });
};

module.exports = { login, logout, refreshToken };
