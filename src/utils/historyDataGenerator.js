module.exports.historyDataGenerator = (user_id, action_by, description) => {
  return {
    user_id: user_id,
    action_by: action_by,
    timestamp: Date.now(),
    description: description,
  };
};
