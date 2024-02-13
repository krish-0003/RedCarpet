const { Factory } = require('rosie');
const { faker } = require('@faker-js/faker');

const userCheckListFactory = Factory.define('userCheckList')
  .sequence('id')
  .attr('checklist_id', () => faker.datatype.number({ min: 1, max: 10 }))
  .attr('checklist_value', () => faker.datatype.boolean());
module.exports = userCheckListFactory;
