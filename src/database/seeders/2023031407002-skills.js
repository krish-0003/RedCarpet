'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'skills',
      [
        {
          name: 'React JS',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Node JS',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'HTML',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'CSS',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('skills', null, {});
  },
};
