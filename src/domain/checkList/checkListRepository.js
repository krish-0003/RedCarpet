const model = require('../../database/models');
const { validateUserById } = require('../user/validateUserById');
const { validateCheckListId } = require('./validateCheckListId');

const CheckLists = model.CheckLists;
const UserCheckLists = model.UserCheckLists;
const Users = model.Users;
const markCheckListValue = async (userId, body) => {
  await validateUserById(userId);
  const { checklistId, checklistValue } = body;
  await validateCheckListId(checklistId);

  const userCheckListValue = await UserCheckLists.findByPk(checklistId);
  (userCheckListValue.checked_by = 'techholdingCheckedBy@email.com'),
    (userCheckListValue.checked_at = new Date()),
    (userCheckListValue.updatedAt = new Date()),
    (userCheckListValue.updatedBy = 'techholdingUpdatedBy@email.com'),
    (userCheckListValue.checklist_value = checklistValue);
  await userCheckListValue.save(); // Save the changes to the database

  const { id, checklist_id, checklist_value } = userCheckListValue;
  const result = { id, checklist_id, checklist_value };

  return result;
};

const getCheckListValue = async (userId) => {
  await validateUserById(userId);

  const data = await Users.findByPk(userId, {
    attributes: ['id', 'status'],
    include: [
      {
        model: CheckLists,
        attributes: ['id', 'checklist_title', 'type'],
        through: {
          attributes: ['id', 'checklist_value'],
        },
      },
    ],
  });

  let newData = {};

  if (data.status === 'active' || data.status === 'pending') {
    // Filter the CheckLists array based on the status value
    const onboardingChecklists = data.CheckLists.filter(
      (checklist) => checklist.type === 'Onboarding'
    );

    // Update the type property of each checklist item
    const updatedChecklists = onboardingChecklists.map((checklist) => {
      return {
        ...checklist.get({ plain: true }),
        type: 'Onboarding',
      };
    });

    // Create a new data object with the updated CheckLists array
    newData = {
      ...data.get({ plain: true }),
      CheckLists: updatedChecklists,
    };
  } else if (data.status === 'offboarded' || data.status === 'offboarding') {
    // Filter the CheckLists array based on the status value
    const offboardingChecklists = data.CheckLists.filter(
      (checklist) => checklist.type === 'Offboarding'
    );

    // Update the type property of each checklist item
    const updatedChecklists = offboardingChecklists.map((checklist) => {
      return {
        ...checklist.get({ plain: true }),
        type: 'Offboarding',
      };
    });

    // Create a new data object with the updated CheckLists array
    newData = {
      ...data.get({ plain: true }),
      CheckLists: updatedChecklists,
    };
  }

  return newData;
};

module.exports = { markCheckListValue, getCheckListValue };
