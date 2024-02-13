'use strict';
const model = require('../../database/models');
const client = model.Clients;
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const techholding = await client.findOne({
      where: {
        name: 'Techholding',
      },
    });

    await queryInterface.bulkInsert('softwares', [
      {
        name: 'Github',
        client_id: techholding.id,
        status: 'active',
        url: 'https://github.com/',
        description: 'For Project repo',
        icon: 'https://img.icons8.com/?size=512&id=3tC9EQumUAuq&format=png',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Slack',
        client_id: techholding.id,
        status: 'active',
        url: 'https://slack.com/intl/en-in/',
        description: 'Description about slack',
        icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Slack_icon_2019.svg/2048px-Slack_icon_2019.svg.png',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Figma',
        client_id: techholding.id,
        status: 'active',
        url: 'https://www.figma.com/',
        description: 'for design',
        icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Figma-logo.svg/1667px-Figma-logo.svg.png',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'AWS',
        client_id: techholding.id,
        status: 'active',
        url: 'https://aws.amazon.com/',
        description: 'for cloud',
        icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Amazon_Web_Services_Logo.svg/1280px-Amazon_Web_Services_Logo.svg.png',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Keka',
        client_id: techholding.id,
        status: 'active',
        url: 'https://www.keka.com/',
        description: 'Description about Keka',
        icon: 'https://images.g2crowd.com/uploads/product/image/large_detail/large_detail_3e67808ec8784d3915e3e6f1da25cd9d/keka-technologies-keka-hr.png',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Gusto',
        client_id: techholding.id,
        status: 'active',
        url: 'https://gusto.com/',
        description: 'Description about Gusto',
        icon: 'https://cdn.cookielaw.org/logos/c778944b-07ba-47c8-9b3f-72816de23729/9604b29a-3551-4858-855c-7161b1e48c5d/fdfee4c0-dabd-4dc5-8745-2a847e76f773/Gusto_logo.png',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Jira',
        client_id: techholding.id,
        status: 'active',
        url: 'https://www.atlassian.com/',
        description: 'Description about Jira',
        icon: 'https://seeklogo.com/images/J/jira-logo-FD39F795A7-seeklogo.com.png',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('softwares', null, {});
  },
};
