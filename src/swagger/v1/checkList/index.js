const getCheckListValue = require('./getCheckListValue');
const markCheckListValue = require('./markCheckListValue');

module.exports = {
  '/users/{userId}/checklist': {
    ...getCheckListValue,
    ...markCheckListValue,
  },
};
