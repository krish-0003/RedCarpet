const getAllBranches = require('./getAllBranches');

module.exports = {
  '/branches': {
    ...getAllBranches,
  },
};
