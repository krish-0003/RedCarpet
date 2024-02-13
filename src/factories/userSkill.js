const { Factory } = require('rosie');
const { faker } = require('@faker-js/faker');

const userSkillFactory = Factory.define('skill')
  .sequence('id')
  .attr('user_id', () => faker.datatype.number({ min: 1, max: 4 }))
  .attr('skill_id', () => faker.datatype.number({ min: 1, max: 10 }))
  .attr('createdAt', () => faker.date.past())
  .attr('updatedAt', () => faker.date.past())
  .attr('createdBy', () => faker.internet.email())
  .attr('updatedBy', () => faker.internet.email());
module.exports = userSkillFactory;
