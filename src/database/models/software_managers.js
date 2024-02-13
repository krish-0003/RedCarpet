'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SoftwareManagers extends Model {
    static associate({ Users }) {
      this.belongsTo(Users, {
        foreignKey: 'manager_id',
      });
    }
  }
  SoftwareManagers.init(
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
          model: 'softwares',
          key: 'id',
        },
      },
      manager_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'users',
          key: 'id',
        },
      },
    },
    {
      sequelize,
      modelName: 'SoftwareManagers',
      tableName: 'software_managers',
    }
  );
  return SoftwareManagers;
};
