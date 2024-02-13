'use strict';
const { Model } = require('sequelize');
const { uniqueConstraintErrorMessages } = require('../../utils/strings');
module.exports = (sequelize, DataTypes) => {
  class Clients extends Model {
    static associate({ Softwares }) {
      this.hasMany(Softwares, {
        foreignKey: 'client_id',
        onUpdate: 'CASCADE',
      });
    }
  }
  Clients.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        unique: {
          msg: uniqueConstraintErrorMessages.client.nameMsg,
        },
      },
      createdBy: {
        type: DataTypes.STRING,
      },
      createdAt: DataTypes.DATE,
      deletedAt: {
        type: DataTypes.DATE,
      },
      deletedBy: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      modelName: 'Clients',
      tableName: 'clients',
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
  return Clients;
};
