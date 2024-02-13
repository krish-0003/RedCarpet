const addUserSoftware = require('./addUserSoftware');
const updateUserSoftware = require('./updateUserSoftware');
const getUserSoftwares = require('./getUserSoftwares');
const sendRevokeEmail = require('./sendRevokeEmail');
const sendAssignEmail = require('./sendAssignEmail');
const deleteUserSoftware = require('./deleteUserSoftware');

module.exports = {
  '/users/{userId}/softwares': {
    ...addUserSoftware,
    ...getUserSoftwares,
  },
  '/users/software/{userSoftwareId}': {
    ...updateUserSoftware,
  },
  '/users/software/assign-email': {
    ...sendAssignEmail,
  },
  '/users/software/revoke-email': {
    ...sendRevokeEmail,
  },
  '/users-softwares': {
    ...deleteUserSoftware,
  },
};
