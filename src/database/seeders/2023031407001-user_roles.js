/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'user_roles',
      [
        {
          role: 'owner',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          role: 'hr manager',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          role: 'manager',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          role: 'lead',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          role: 'employee',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('user_roles', null, {});
  },
};
