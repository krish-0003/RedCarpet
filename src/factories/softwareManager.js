const { Factory } = require('rosie');
const { faker } = require('@faker-js/faker');

const softwareManagerFactory = Factory.define('softwareManager')
  .sequence('id')
  .attr('software_id', faker.datatype.number())
  .attr('client_id', () => faker.datatype.number())
  .attr('createdAt', () => faker.date.past())
  .attr('updatedAt', () => faker.date.past());

module.exports = softwareManagerFactory;
