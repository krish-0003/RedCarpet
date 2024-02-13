const updateUser = require('./updateUser');
const deleteUser = require('./deleteUser');
const getUserById = require('./getUserById');
const getUsers = require('./getUsers');
const addUserSkills = require('./skills/addUserSkills');
const getUserSkills = require('./skills/getUserSkills');
const changeStatusOfEmployee = require('./changeStatusOfEmployee');
const addUser = require('./addUser');
const getUserHistory = require('./getUserHistory');
const getAllSkills = require('./skills/getAllSkills');
const deleteUserSkills = require('./skills/deleteUserSkills');
const addMultipleUsers = require('./addMultipleUsers');

module.exports = {
  '/users': {
    ...getUsers,
    ...addUser,
  },
  '/allusers': {
    ...addMultipleUsers,
  },
  '/users/{userId}': {
    ...getUserById,
    ...updateUser,
    ...deleteUser,
  },

  '/users/{userId}/skills': {
    ...addUserSkills,
    ...getUserSkills,
    ...deleteUserSkills,
  },
  '/users/{userId}/history': {
    ...getUserHistory,
  },
  '/users/{userId}/approve': {
    ...changeStatusOfEmployee,
  },
  '/skills': {
    ...getAllSkills,
  },
};
