'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'branches',
      [
        {
          name: 'Ahmedabad, India',
          location: 'India',
          prefix: 'TH/IN/AHM/',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Pune, India',
          location: 'India',
          prefix: 'TH/IN/PUN/',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Chennai, India',
          location: 'India',
          prefix: 'TH/IN/CHI/',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Los Angeles, USA',
          location: 'USA',
          prefix: 'TH/USA/LA/',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Hermosillo, Mexico',
          location: 'Mexico',
          prefix: 'TH/MX/HM/',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Remote',
          location: 'Remote',
          prefix: '',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('branches', null, {});
  },
};
