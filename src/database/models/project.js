'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Projects extends Model {
    static associate(models) {}
  }
  Projects.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
      },
      duration: {
        type: DataTypes.INTEGER,
      },
      manager_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      lead_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      type: {
        type: DataTypes.ENUM('company', 'client'),
      },
      description: {
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
      modelName: 'Projects',
      tableName: 'projects',
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
  return Projects;
};
