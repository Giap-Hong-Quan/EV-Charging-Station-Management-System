"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class UserRole extends Model {
    static associate(models) {
      UserRole.belongsTo(models.User, {
        foreignKey: "user_id",
        as: "user",
      });
    }
  }
  UserRole.init(
    {
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
      },
      role: {
        type: DataTypes.ENUM("admin", "driver", "customer"),
        allowNull: false,
        defaultValue: "driver",
      },
      permissions: {
        type: DataTypes.JSON,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "UserRole",
      tableName: "user_roles",
      underscored: true,
      timestamps: true,
    }
  );
  return UserRole;
};
