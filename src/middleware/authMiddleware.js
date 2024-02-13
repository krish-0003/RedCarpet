const { default: axios } = require('axios');
const jwt = require('jsonwebtoken');
const moment = require('moment');
const {
  ForbiddenRequestError,
  BadRequestError,
  UnauthorizedRequestError,
} = require('../utils/customException');
const model = require('../database/models');
const { Sequelize } = require('sequelize');
const { error } = require('../utils/responseGenerator');
const { statusWithoutLoginAccess } = require('../utils/strings');

const Tokens = model.Tokens;

const getUserInfoByToken = async (token) => {
  const headers = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const url = process.env.GOOGLE_AUTH_URL;
  const userData = await axios.get(url, headers);
  const users = model.Users;

  // get user's id from database and store it in user object.

  const user = await users.findOne({
    where: {
      company_email: Sequelize.where(
        Sequelize.fn('LOWER', Sequelize.col('company_email')),
        '=',
        userData.data.email.toLowerCase()
      ),
    },
    attributes: ['id', 'role_id', 'status'],
    logging: false,
  });
  if (!user) {
    throw new ForbiddenRequestError('User not found');
  }

  if (statusWithoutLoginAccess.includes(user.status)) {
    throw new UnauthorizedRequestError('Access Denied');
  }

  const { id: userId, role_id: role } = user;
  if (role > 3) {
    throw new UnauthorizedRequestError('User Not Authorized');
  }

  const { email, family_name, given_name, name, picture } = userData.data;
  return { email, family_name, given_name, name, picture, userId, role };
};

const authenticateUser = async (req, res, next) => {
  if (!req.headers.hasOwnProperty('authorization')) {
    return res
      .status(403)
      .json(error(new ForbiddenRequestError('Something went wrong')));
  }

  const accessToken = req.headers['authorization'].split(' ')[1];

  jwt.verify(
    accessToken,
    process.env.JWT_ACCESS_TOKEN_KEY,
    async (err, user) => {
      if (err) {
        // if access token is expired then delete the refresh token
        if (err.name === 'TokenExpiredError') {
          const tokenPayload = jwt.decode(accessToken);
          await Tokens.destroy({
            where: { user_id: tokenPayload.userId },
          });
        }
        return res
          .status(403)
          .json(
            error(
              new ForbiddenRequestError('Login expired, Please Login again')
            )
          );
      } else {
        if (user.role > 3) {
          throw new UnauthorizedRequestError('User Not Authorized');
        }
        req.user = user;
        next();
      }
    }
  );
};

const refreshTokenMiddleware = (req, res, next) => {
  if (!req.headers.hasOwnProperty('authorization')) {
    return res
      .status(403)
      .json(error(new ForbiddenRequestError('Something went wrong')));
  }

  const accessToken = req.headers['authorization'].split(' ')[1];

  jwt.verify(
    accessToken,
    process.env.JWT_ACCESS_TOKEN_KEY,
    async (err, user) => {
      if (err) {
        // if access token is expired then generate new access token
        if (err.name === 'TokenExpiredError') {
          next();
        } else {
          // if access token is malformed then return forbidden request error
          return res
            .status(403)
            .json(
              error(
                new ForbiddenRequestError('Login expired, Please Login again')
              )
            );
        }
      } else {
        const expiryTime = user.exp;
        const expiryBufferTime =
          process.env.JWT_ACCESS_TOKEN_BUFFER_EXPIRY_TIME || '5m';
        const needToRefresh =
          moment.unix(expiryTime) <=
          moment().add(
            expiryBufferTime.slice(0, -1),
            expiryBufferTime.slice(-1)
          );
        if (needToRefresh) {
          next();
        } else {
          return res
            .status(400)
            .json(
              error(
                new BadRequestError(
                  'Access token is valid. No need to refresh it.'
                )
              )
            );
        }
      }
    }
  );
};

module.exports = {
  authenticateUser,
  getUserInfoByToken,
  refreshTokenMiddleware,
};
