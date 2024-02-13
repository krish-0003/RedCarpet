const { Factory } = require('rosie');
const { faker } = require('@faker-js/faker');

const softwareFactory = Factory.define('software')
  .sequence('id')
  .attr('name', faker.name.fullName)
  .attr('client_id', 0)
  .attr('client_name', faker.company)
  .attr('status', 'active')
  .attr('url', faker.internet.email)
  .attr('description', faker.definitions.company)
  .attr('icon', faker.image.avatar)
  .attr('createdAt', faker.date)
  .attr('updatedAt', faker.date)
  .attr('createdBy', faker.internet.email)
  .attr('updatedBy', faker.internet.email)
  .attr('deletedAt', null)
  .attr('deletedBy', null);

module.exports = softwareFactory;
