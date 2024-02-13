'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserHardwares extends Model {
    static associate(models) {}
  }
  UserHardwares.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      hardware_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'hardwares',
          key: 'id',
        },
      },
      user_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      date_time: {
        type: DataTypes.DATE,
      },
      status: {
        type: DataTypes.ENUM('assigned', 'revoked', 'issue-logged', 'deleted'),
      },
      note: {
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
      modelName: 'UserHardwares',
      tableName: 'user_hardwares',
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
  return UserHardwares;
};
