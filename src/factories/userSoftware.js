const { Factory } = require('rosie');
const { faker } = require('@faker-js/faker');

const userSoftware = Factory.define('userSoftware')
  .sequence('id')
  .sequence('software_id')
  .sequence('user_id')
  .attr('assign_date', faker.date.past())
  .attr('last_email_date', faker.date.past())
  .attr('note', faker.lorem.lines)
  .attr('status', 'active')
  .attr('username', faker.internet.userName())
  .attr('assign_date', faker.date.past())
  .attr('createdAt', faker.date.past())
  .attr('updatedAt', faker.date.past())
  .attr('createdBy', faker.internet.email)
  .attr('updatedBy', faker.internet.email)
  .attr('deletedAt', null)
  .attr('deletedBy', null);

module.exports = userSoftware;
