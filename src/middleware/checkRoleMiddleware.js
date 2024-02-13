const { UnauthorizedRequestError } = require('../utils/customException');
const errorMessage = require('../utils/errorMessage');
const { error } = require('../utils/responseGenerator');
const verifyRole = require('../utils/roleAccess');

// checkRole is middleware, takes array of strings containing roles value. It requires email in req body.
// middleware checks if user with provided email has role from roles provied in argument.
const checkRole = (roles) => {
  return async function (req, res, next) {
    try {
      // check if user trying to login has access to system or not.
      const isAuthenticated = await verifyRole(roles, req.user.email);

      //forward to next if user has Authenticated role.
      if (isAuthenticated) next();
      // throw error if user does not have authenticated roles.
      else throw new UnauthorizedRequestError(errorMessage.statusCode401);
    } catch (err) {
      res.status(err?.code || err[0]?.code || 500).json(error(err));
    }
  };
};

module.exports = checkRole;
