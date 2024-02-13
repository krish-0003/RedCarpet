const { Factory } = require('rosie');
const { faker } = require('@faker-js/faker');

const clientFactory = Factory.define('client')
  .sequence('id')
  .attr('name', () => faker.name.firstName())
  .attr('createdAt', () => faker.date.past())
  .attr('createdBy', () => faker.internet.email());

module.exports = clientFactory;
