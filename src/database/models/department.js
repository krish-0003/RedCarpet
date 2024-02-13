'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Departments extends Model {
    static associate(models) {}
  }
  Departments.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      name: {
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
    },
    {
      sequelize,
      modelName: 'Departments',
      tableName: 'departments',
      schema: 'public',
      timestamps: true,
    }
  );
  return Departments;
};
