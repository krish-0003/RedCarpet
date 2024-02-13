const { Factory } = require('rosie');
const { faker } = require('@faker-js/faker');

const branchFactory = Factory.define('branch')
  .sequence('id')
  .attr('name', () => faker.company.name())
  .attr('location', () => faker.address.country)
  .attr('prefix', () => faker.company.companySuffix)
  .attr('createdAt', () => faker.date.past())
  .attr('updatedAt', () => faker.date.past())
  .attr('createdBy', () => faker.internet.email())
  .attr('updatedBy', () => faker.internet.email());

module.exports = branchFactory;
