'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Histories extends Model {
    static associate({ Users }) {
      this.belongsTo(Users, { foreignKey: 'action_by' });
    }
  }
  Histories.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      user_id: DataTypes.INTEGER,

      timestamp: DataTypes.DATE,
      action_by: DataTypes.INTEGER,
      description: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Histories',
      tableName: 'histories',
      timestamps: false,
    }
  );
  return Histories;
};
