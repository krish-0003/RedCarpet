const { Model } = require('sequelize');
const { uniqueConstraintErrorMessages } = require('../../utils/strings');

module.exports = (sequelize, DataTypes) => {
  class Agencies extends Model {
    static associate(models) {}
  }
  Agencies.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      agency_name: {
        type: DataTypes.STRING,
      },
      person_name: {
        type: DataTypes.STRING,
      },
      email: {
        type: DataTypes.STRING,
        unique: {
          msg: uniqueConstraintErrorMessages.agency.emailMsg,
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
      modelName: 'Agencies',
      tableName: 'agencies',
      schema: 'public',
      timestamps: true,
    }
  );
  return Agencies;
};
