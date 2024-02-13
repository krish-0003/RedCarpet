const model = require('../../database/models');

const Branch = model.Branches;

const getAllBranches = async () => {
  const branches = await Branch.findAll({
    attributes: ['id', 'name', 'location', 'prefix'],
    raw: true,
  });

  return branches;
};

module.exports = {
  getAllBranches,
};
