const { Factory } = require('rosie');
const { faker } = require('@faker-js/faker');

const userFactory = Factory.define('users')
  .sequence('id')
  .attr('employee_id', () => faker.random.alphaNumeric())
  .attr('first_name', () => faker.name.firstName())
  .attr('last_name', () => faker.name.lastName())
  .attr('company_email', () => faker.internet.email())
  .attr('personal_email', () => faker.internet.email())
  .attr('country_code', () => faker.address.countryCode())
  .attr('phone_number', () => faker.phone.number())
  .attr('address', () => faker.address.streetAddress())
  .attr('city', () => faker.address.city())
  .attr('status', () => faker.random.word())
  .attr('state', () => faker.address.state())
  .attr('zipcode', () => faker.address.zipCode())
  .attr('branch_id', () => faker.datatype.number({ min: 1, max: 4 }))
  .attr('employment_type', () =>
    faker.helpers.arrayElement(['intern', 'full-time', 'contractor'])
  )
  .attr('jobTitle', () => faker.name.jobTitle())
  .attr('agency_id', () => faker.datatype.number({ min: 1, max: 10 }))
  .attr('join_date', () => faker.date.past())
  .attr('end_date', () => faker.date.future())
  .attr('capacity', () => faker.datatype.number({ min: 1, max: 40 }))
  .attr('role', () => faker.datatype.number({ min: 1, max: 4 }))
  .attr('status', () =>
    faker.helpers.arrayElement(['active', 'offboarding', 'pending'])
  )
  .attr('note', () => faker.lorem.sentence())
  .attr('manager_id', () => faker.datatype.number({ min: 1, max: 10 }))
  .attr('department_id', () => faker.datatype.number({ min: 1, max: 10 }))
  .attr('createdAt', faker.date.past())
  .attr('updatedAt', faker.date.past())
  .attr('createdBy', faker.internet.email)
  .attr('updatedBy', faker.internet.email)
  .attr('deletedAt', null)
  .attr('deletedBy', null);

module.exports = userFactory;
