'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CheckLists extends Model {
    static associate({ Users, UserCheckLists }) {
      this.belongsToMany(Users, {
        through: { model: UserCheckLists },
        foreignKey: 'checklist_id',
      });
    }
  }
  CheckLists.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      checklist_title: {
        type: DataTypes.STRING,
      },

      type: {
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
      modelName: 'CheckLists',
      tableName: 'checklists',
      schema: 'public',
      timestamps: true,
    }
  );

  CheckLists.afterCreate(async (checklist) => {
    // here we haven't created any api for adding new checklist value,so we have to add any checklist value through the seeders only(because it uses the sequlize ,and afterCreate only works on data entry through the sequlize )
    const allUsers = await sequelize.models.Users.findAll({
      attributes: ['id'],
    });
    const bulkUserChecklist = allUsers.map((data) => ({
      user_id: data.id,
      checklist_id: checklist.id,
      checklist_value: false,
      checked_by: 'techholding@email.com',
      checked_at: new Date(),
      created_at: new Date(),
      updated_at: new Date(),
      created_by: 'techholding1@email.com',
      updated_by: 'techholding1@email.com',
    }));
    await sequelize.models.UserCheckLists.bulkCreate(bulkUserChecklist);
  });

  return CheckLists;
};
