const { Factory } = require('rosie');
const { faker } = require('@faker-js/faker');

const checkListFactory = Factory.define('checkList')
  .sequence('id')
  .attr('checklist_title', () => faker.name.jobDescriptor())
  .attr('type', () => faker.name.jobType())
  .attr('createdAt', () => faker.date.past())
  .attr('updatedAt', () => faker.date.past())
  .attr('createdBy', () => faker.internet.email())
  .attr('updatedBy', () => faker.internet.email());

module.exports = checkListFactory;
