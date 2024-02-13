'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class HardwareCategories extends Model {
    static associate(models) {}
  }
  HardwareCategories.init(
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
      modelName: 'HardwareCategories',
      tableName: 'hardware_categories',
      schema: 'public',
      timestamps: true,
    }
  );
  return HardwareCategories;
};
