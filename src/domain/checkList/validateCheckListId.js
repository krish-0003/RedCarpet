const model = require('../../database/models');
const { NotFoundError } = require('../../utils/customException');

const UserCheckLists = model.UserCheckLists;
const validateCheckListId = async (id) => {
  const userCheckListsCount = await UserCheckLists.count({ where: { id: id } });
  if (!userCheckListsCount) {
    throw new NotFoundError('No CheckLists Id Found.', 'CheckLists');
  }
};

module.exports = { validateCheckListId };
