const { Model, Op } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Softwares extends Model {
    static associate({ UserSoftwares, SoftwareManagers, Users, Clients }) {
      this.hasMany(UserSoftwares, {
        foreignKey: 'software_id',
        onDelete: 'CASCADE',
      });
      this.hasMany(SoftwareManagers, {
        as: 'SoftwareAlias',
        foreignKey: 'software_id',
        onDelete: 'CASCADE',
      });
      this.belongsToMany(Users, {
        as: 'Managers',
        through: {
          model: SoftwareManagers,
        },
        foreignKey: 'software_id',
      });
      this.belongsTo(Clients, {
        foreignKey: 'client_id',
      });
    }
  }
  Softwares.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      client_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'clients',
          key: 'id',
        },
        unique: 'compositeIndex',
      },

      name: {
        type: DataTypes.STRING,
        unique: 'compositeIndex',
      },

      status: {
        type: DataTypes.ENUM('active', 'inactive'),
      },
      url: {
        type: DataTypes.STRING,
      },
      description: {
        type: DataTypes.STRING,
      },
      icon: {
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
      modelName: 'Softwares',
      tableName: 'softwares',
      schema: 'public',
      timestamps: true,
      defaultScope: {
        where: {
          deletedAt: null,
          deletedBy: null,
        },
      },
      indexes: [
        {
          unique: true,
          fields: ['client_id', 'name'],
          name: 'compositeIndex',
        },
      ],
    }
  );

  return Softwares;
};
