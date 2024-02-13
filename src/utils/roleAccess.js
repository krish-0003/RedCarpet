const { getUserRoleByEmail } = require('../domain/user/userRepository');

// verifyRole checks if user with provided email has one of role from roles provided.
const verifyRole = async (roles, email) => {
  //get userRole.
  const userRole = await getUserRoleByEmail(email);
  // if user role if from roles , return true.
  if (roles.includes(userRole)) return true;

  return false;
};
module.exports = verifyRole;
