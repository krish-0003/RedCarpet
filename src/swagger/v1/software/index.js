const createSoftware = require('./createSoftware');
const updateSoftware = require('./updateSoftware');
const deleteSoftware = require('./deleteSoftware');
const getAllSoftwares = require('./getSoftwares');
const getSoftwareById = require('./getSoftwareById');
const getSoftwareUsers = require('./getSoftwareUsers');
const getAllSoftwaresByClientId = require('./getSoftwaresByClientId');
const getAllClients = require('./getAllClients');

module.exports = {
  '/softwares': {
    ...getAllSoftwares,
    ...createSoftware,
  },
  '/softwares/{softwareId}': {
    ...getSoftwareById,
    ...updateSoftware,
    ...deleteSoftware,
  },
  '/softwares/{softwareId}/users': {
    ...getSoftwareUsers,
  },
  '/clients': {
    ...getAllClients,
  },
  '/softwares/clients/{clientId}': {
    ...getAllSoftwaresByClientId,
  },
};
