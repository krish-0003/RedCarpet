const healthcheck = require('./healthCheck');

module.exports = {
  '/health-check': {
    ...healthcheck,
  },
};
