'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Hardwares extends Model {
    static associate(models) {}
  }
  Hardwares.init(
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
      category_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'harware_categories',
          key: 'id',
        },
      },
      serial_key: {
        type: DataTypes.STRING,
      },
      branch_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'branches',
          key: 'id',
        },
      },
      model_number: {
        type: DataTypes.STRING,
      },
      vendor_name: {
        type: DataTypes.STRING,
      },
      description: {
        type: DataTypes.STRING,
      },
      purchase_date: {
        type: DataTypes.DATE,
      },
      bill_image_url: {
        type: DataTypes.STRING,
      },
      status: {
        type: DataTypes.ENUM(
          'available',
          'not-available',
          'assigned',
          'deleted'
        ),
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
      modelName: 'Hardwares',
      tableName: 'hardwares',
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
  return Hardwares;
};
