const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class UserCheckLists extends Model {
    static associate({ CheckLists }) {
      this.belongsTo(CheckLists, {
        foreignKey: 'checklist_id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
    }
  }
  UserCheckLists.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      checklist_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'checklists',
          key: 'id',
        },
      },
      checklist_value: {
        type: DataTypes.BOOLEAN,
      },
      checked_by: {
        type: DataTypes.STRING,
      },
      checked_at: {
        type: DataTypes.DATE,
      },
      user_id: {
        type: DataTypes.STRING,
        references: {
          model: 'users',
          key: 'id',
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
      modelName: 'UserCheckLists',
      tableName: 'user_checklists',
      schema: 'public',
      timestamps: true,
    }
  );
  return UserCheckLists;
};
