'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'checklists',
      [
        {
          checklist_title: 'Create Profile',
          type: 'Onboarding',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          checklist_title: 'Collect Documents',
          type: 'Onboarding',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          checklist_title: 'Provide Welcome Kit',
          type: 'Onboarding',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          checklist_title: 'Assign Hardware',
          type: 'Onboarding',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          checklist_title: 'Coordinating final paycheck and benefits',
          type: 'Offboarding',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          checklist_title: 'Revoke Hardware',
          type: 'Offboarding',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          checklist_title: 'Deactivate Accounts',
          type: 'Offboarding',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('checklists', null, {});
  },
};
