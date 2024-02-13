const { Model } = require('sequelize');
const {
  checkListDataGenerator,
} = require('../../utils/checkListDataGenerator');
const { historyDataGenerator } = require('../../utils/historyDataGenerator');
const software = require('./software');
const moment = require('moment');
const { uniqueConstraintErrorMessages } = require('../../utils/strings');

module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    static associate({
      Users,
      Branches,
      Agencies,
      Histories,
      Departments,
      UserSoftwares,
      SoftwareManagers,
      Softwares,
      UserSkills,
      Skills,
      UserRoles,
      CheckLists,
      UserCheckLists,
    }) {
      this.belongsTo(Branches, {
        foreignKey: 'branch_id',
      });
      this.belongsTo(Agencies, {
        foreignKey: 'agency_id',
      });
      this.belongsTo(Departments, {
        foreignKey: 'department_id',
      });
      this.belongsTo(Users, {
        foreignKey: 'manager_id',
        as: 'Manager',
      });
      this.hasMany(UserSoftwares, {
        foreignKey: 'user_id',
      });

      this.hasMany(Histories, { foreignKey: 'action_by' });
      // this.hasMany(UserSkills, { foreignKey: 'user_id' });
      // UserSkills.belongsTo(this, { foreignKey: 'id' });
      this.belongsToMany(Skills, {
        through: {
          model: UserSkills,
        },
        foreignKey: 'user_id',
      });
      this.belongsToMany(Softwares, {
        through: {
          model: SoftwareManagers,
        },
        foreignKey: 'manager_id',
      });
      this.belongsTo(UserRoles, {
        foreignKey: 'role_id',
      });
      this.belongsToMany(CheckLists, {
        through: { model: UserCheckLists },
        foreignKey: 'user_id',
      });
    }
  }
  Users.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      employee_id: {
        type: DataTypes.STRING,
        unique: {
          msg: uniqueConstraintErrorMessages.user.employeeIdMsg,
        },
      },
      first_name: {
        type: DataTypes.STRING,
      },
      last_name: {
        type: DataTypes.STRING,
      },
      company_email: {
        type: DataTypes.STRING,
        unique: {
          msg: uniqueConstraintErrorMessages.user.companyEmailMsg,
        },
      },
      personal_email: {
        type: DataTypes.STRING,
        unique: {
          msg: uniqueConstraintErrorMessages.user.personalEmailMsg,
        },
      },
      country_code: {
        type: DataTypes.STRING,
      },
      phone_number: {
        type: DataTypes.STRING,
        unique: {
          msg: uniqueConstraintErrorMessages.user.phoneNumberMsg,
        },
      },
      address: {
        type: DataTypes.STRING,
      },
      city: {
        type: DataTypes.STRING,
      },
      state: {
        type: DataTypes.STRING,
      },
      zipcode: {
        type: DataTypes.STRING,
      },
      branch_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'branches',
          key: 'id',
        },
      },
      join_date: {
        type: DataTypes.DATE,
      },
      end_date: {
        type: DataTypes.DATE,
      },
      capacity: {
        type: DataTypes.INTEGER,
      },
      role_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'user_roles',
          key: 'id',
        },
      },
      employment_type: {
        type: DataTypes.ENUM([
          'intern',
          'full-time',
          'contractor',
          'part-time',
        ]),
      },
      job_title: {
        type: DataTypes.STRING,
      },
      status: {
        type: DataTypes.ENUM([
          'active',
          'offboarding',
          'pending',
          'offboarded',
        ]),
      },
      note: {
        type: DataTypes.STRING,
      },
      agency_id: {
        type: DataTypes.INTEGER,

        references: {
          model: 'agencies',
          key: 'id',
        },
      },
      department_id: {
        type: DataTypes.INTEGER,

        references: {
          model: 'departments',
          key: 'id',
        },
      },
      manager_id: {
        type: DataTypes.INTEGER,
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
      deletedAt: {
        type: DataTypes.DATE,
      },
      deletedBy: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      modelName: 'Users',
      tableName: 'users',
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
  Users.prototype.checkListEntry = async function (userId, typeName) {
    const checklistAll = await sequelize.models.CheckLists.findAll({
      where: { type: typeName },
      attributes: ['id'],
    });

    const bulkUserChecklist = checklistAll.map((data) => {
      return checkListDataGenerator(userId, data.id);
    });
    await sequelize.models.UserCheckLists.bulkCreate(bulkUserChecklist);
  };

  //hooks section for user history and manual creation of User
  Users.afterCreate(async (user, option) => {
    // Defined static userId here need to change with actual value from cookies
    const userId = option.userObj.userId;
    const currentUser = option.userObj.name;

    const description = `Employee profile created for ${user.first_name} ${user.last_name} by ${currentUser}`;
    const historyData = historyDataGenerator(user.id, userId, description);

    await sequelize.models.Histories.create(historyData);
    await user.checkListEntry(user.id, 'Onboarding');
  });
  Users.afterBulkCreate(async (users, option) => {
    const userId = option.userObj.userId;
    const currentUser = option.userObj.name;
    users.map(async (user) => {
      const description = `Employee profile created for ${user.first_name} ${user.last_name} by ${currentUser}`;
      const historyData = historyDataGenerator(user.id, userId, description);
      await sequelize.models.Histories.create(historyData);

      await user.checkListEntry(user.id, 'Onboarding');
    });
  });
  let changedField, previousUser;
  Users.beforeUpdate((user) => {
    previousUser = user._previousDataValues;
    changedField = user.changed();
  });
  Users.afterUpdate(async (user, option) => {
    // Defined static userId ,userFirstName , userLastName here need to change with actual value from cookies
    const userId = option.userObj.userId;
    const userFirstName = option.userObj.name;
    changedField.map(async (data) => {
      const requiredField = ['status', 'end_date'];
      if (requiredField.includes(data)) {
        let description;
        if (data === 'status') {
          if (user.dataValues[data] === 'active') {
            description = `${userFirstName} approved ${user.first_name} ${user.last_name}'s profile`;
          } else if (user.dataValues[data] === 'offboarding') {
            description = `Off-boarding started for ${user.first_name} ${user.last_name} by ${userFirstName}`;

            await user.checkListEntry(user.id, 'Offboarding');

            // removing user from software manager as user is offboarding
            await sequelize.models.SoftwareManagers.destroy({
              where: { manager_id: user.id },
            });
          } else if (user.dataValues[data] === 'offboarded') {
            description = `Off-boarding completed for ${user.first_name} ${user.last_name} by ${userFirstName}`;
            await sequelize.models.Tokens.destroy({
              where: { user_id: user.id },
            });
          }
        } else if (data === 'end_date') {
          if (previousUser.end_date)
            description = `Last date updated to ${moment(user.end_date).format(
              'MMM Do YYYY'
            )} from ${moment(previousUser.end_date).format(
              'MMM Do YYYY'
            )} for ${user.dataValues.first_name} ${
              user.dataValues.last_name
            } by ${userFirstName}`;
          else
            description = `Last date  ${moment(user.dataValues.end_date).format(
              'MMM Do YYYY'
            )} added for ${user.dataValues.first_name} ${
              user.dataValues.last_name
            } by ${userFirstName}`;
        }
        const historyData = historyDataGenerator(user.id, userId, description);

        await sequelize.models.Histories.create(historyData);
      } else return;
    });
  });

  return Users;
};
