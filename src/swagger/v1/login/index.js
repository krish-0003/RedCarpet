const login = require('./login');
const logout = require('./logout');

module.exports = {
  '/login': {
    ...login,
  },
  '/logout': {
    ...logout,
  },
};
