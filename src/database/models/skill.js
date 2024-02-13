'use strict';
const { Model } = require('sequelize');
const { uniqueConstraintErrorMessages } = require('../../utils/strings');
module.exports = (sequelize, DataTypes) => {
  class Skills extends Model {
    static associate({ Users, UserSkills }) {
      this.belongsToMany(Users, {
        through: {
          model: UserSkills,
        },
        foreignKey: 'skill_id',
      });
    }
  }
  Skills.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        unique: {
          msg: uniqueConstraintErrorMessages.skill.nameMsg,
        },
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
      modelName: 'Skills',
      tableName: 'skills',
      schema: 'public',
      timestamps: true,
    }
  );
  return Skills;
};
