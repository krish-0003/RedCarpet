const model = require('../../database/models');
const { NotFoundError } = require('../../utils/customException');

const User = model.Users;

const validateUserById = async (id) => {
  const userCount = await User.count({ where: { id: id } });
  if (!userCount) {
    throw new NotFoundError('No user found.');
  }
};

module.exports = { validateUserById };
