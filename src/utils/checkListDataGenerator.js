module.exports.checkListDataGenerator = (userId, dataId) => {
  return {
    user_id: userId,
    checklist_id: dataId,
    checklist_value: false,
    checked_by: 'techholdingChecked@email.com',
    checked_at: new Date(),
    created_at: new Date(),
    updated_at: new Date(),
    created_by: 'techholdingCreated@email.com',
    updated_by: 'techholdingUpdated@email.com',
  };
};
