'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'users',
      [
        {
          employee_id: 'TH/IN/AHM/111',
          first_name: 'Vaibhav',
          last_name: 'Patel',
          company_email: 'vaibhav.patel@techholding.co',
          personal_email: 'vaibhav@gmail.com',
          country_code: '+91',
          phone_number: '9825118142',
          address: 'Satellite,Jodhpur Cross Road',
          city: 'Ahmedabad',
          state: 'Gujarat,India',
          zipcode: '380015',
          branch_id: 1,
          join_date: '2019-05-01 05:30:00+05:30',
          end_date: null,
          capacity: 40,
          role_id: 1,
          employment_type: 'full-time',
          job_title: 'Owner',
          status: 'active',
          note: 'This is Vaibhav Patel',
          agency_id: null,
          department_id: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {});
  },
};
