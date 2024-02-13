'use strict';
const { Model } = require('sequelize');
const { uniqueConstraintErrorMessages } = require('../../utils/strings');
module.exports = (sequelize, DataTypes) => {
  class Tokens extends Model {
    static associate({ Users }) {
      this.belongsTo(Users, {
        foreignKey: 'user_id',
      });
    }
  }
  Tokens.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Users',
          key: 'id',
        },
        unique: {
          msg: uniqueConstraintErrorMessages.token.userIdMsg,
        },
      },
      refresh_token: {
        type: DataTypes.TEXT,
        unique: {
          msg: uniqueConstraintErrorMessages.token.refreshTokenMsg,
        },
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: 'Tokens',
      tableName: 'tokens',
      schema: 'public',
      timestamps: true,
    }
  );
  return Tokens;
};
