'use strict';
const { Model } = require('sequelize');
const { historyDataGenerator } = require('../../utils/historyDataGenerator');

module.exports = (sequelize, DataTypes) => {
  class UserSoftwares extends Model {
    static associate({ Softwares, Users }) {
      this.belongsTo(Softwares, {
        foreignKey: 'software_id',
      });
      this.belongsTo(Users, {
        foreignKey: 'user_id',
      });
    }
  }
  UserSoftwares.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      software_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Softwares',
          key: 'id',
        },
      },
      user_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Users',
          key: 'id',
        },
      },
      assign_date: DataTypes.DATE,
      last_email_date: DataTypes.DATE,
      note: {
        type: DataTypes.ARRAY(DataTypes.JSON()),
        defaultValue: [],
      },
      status: {
        type: DataTypes.ENUM('active', 'pending', 'revoked'),
      },
      username: {
        type: DataTypes.STRING,
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
      createdBy: {
        type: DataTypes.STRING,
      },
      updatedBy: {
        type: DataTypes.STRING,
      },
      deletedAt: {
        type: DataTypes.DATE,
      },
      deletedBy: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      modelName: 'UserSoftwares',
      tableName: 'user_softwares',
      schema: 'public',
      timestamps: true,
      defaultScope: {
        where: {
          deletedAt: null,
          deletedBy: null,
        },
      },
    }
  );

  //hooks for user software history
  UserSoftwares.afterBulkCreate(async (userSoftware, option) => {
    userSoftware.map(async (data) => {
      // Defined static userId here need to change with actual value from cookies
      let currentUserId;
      let userName;
      if (option.reqUserObj) {
        currentUserId = option.reqUserObj.userId;
        userName = option.reqUserObj.name;
      }

      const { name: softwareName } = await sequelize.models.Softwares.findByPk(
        data.software_id,
        {
          raw: true,
          attributes: ['name'],
        }
      );
      const { first_name: userFirstName, last_name: userLastName } =
        await sequelize.models.Users.findByPk(data.user_id, {
          raw: true,
          attributes: ['first_name', 'last_name'],
        });
      const description = `${softwareName} software requested for ${userFirstName} ${userLastName} by ${userName}`;
      const historyData = historyDataGenerator(
        data.user_id,
        currentUserId,
        description
      );

      await sequelize.models.Histories.create(historyData);
    });
  });

  let changedField;
  UserSoftwares.beforeUpdate((userSoftware) => {
    changedField = userSoftware.changed();
  });
  UserSoftwares.afterUpdate(async (userSoftware, option) => {
    // Defined static userId ,userFirstName , userLastName here need to change with actual value from cookies
    let currentUserId;
    let userName;
    if (option.reqUserObj) {
      (currentUserId = option.reqUserObj.id),
        (userName = option.reqUserObj.name);
    }
    const { name: softwareName } = await sequelize.models.Softwares.findByPk(
      userSoftware.software_id,
      {
        raw: true,
        attributes: ['name'],
      }
    );

    if (changedField.includes('status')) {
      let description;

      if (userSoftware.status === 'active') {
        description = `${userName} has assigned ${softwareName} software`;
        userSoftware.last_email_date = null;
        userSoftware.save();
      }
      if (userSoftware.status === 'revoked') {
        description = `${userName} has revoked ${softwareName} software`;
      }
      const historyData = historyDataGenerator(
        userSoftware.user_id,
        currentUserId,
        description
      );

      await sequelize.models.Histories.create(historyData);
    }
  });

  return UserSoftwares;
};
