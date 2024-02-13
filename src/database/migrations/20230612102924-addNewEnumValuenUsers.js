'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('users', 'employment_type', {
      type: Sequelize.ENUM('intern', 'full-time', 'contractor', 'part-time'),
      allowNull: false,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('users', 'employment_type', {
      type: Sequelize.ENUM('intern', 'full-time', 'contractor'),
      allowNull: false,
    });
  },
};
