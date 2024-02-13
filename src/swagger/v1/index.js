const basicInfo = require('./basicInfo');
const components = require('./components');
const user = require('./user');
const software = require('./software');
const userSoftware = require('./userSoftware');
const servers = require('./servers');
const healthCheck = require('./healthCheck');
const checkList = require('./checkList');
const login = require('./login');
const branch = require('./branch');
module.exports = {
  ...basicInfo,
  ...servers,
  ...components,
  paths: {
    ...login,
    ...user,
    ...software,
    ...userSoftware,
    ...checkList,
    ...healthCheck,
    ...branch,
  },
  security: [{ bearerAuth: [] }],
};
