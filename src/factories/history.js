const { Factory } = require('rosie');
const { faker } = require('@faker-js/faker');

const historyFactory = Factory.define('audits')
  .sequence('id')
  .attr('user_id', faker.datatype.number)
  .attr('timestamp', faker.date)
  .attr('action_by', faker.datatype.number)
  .attr('description', faker.datatype.string);

module.exports = historyFactory;
