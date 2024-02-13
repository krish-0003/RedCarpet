const { Factory } = require('rosie');
const { faker } = require('@faker-js/faker');

const skillFactory = Factory.define('skill')
  .sequence('id')
  .attr('name', () => faker.name.firstName())
  .attr('createdAt', () => faker.date.past())
  .attr('updatedAt', () => faker.date.past())
  .attr('createdBy', () => faker.internet.email())
  .attr('updatedBy', () => faker.internet.email());

module.exports = skillFactory;
