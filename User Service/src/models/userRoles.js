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
      user_id: DataTypes.INTEGER,
      role: DataTypes.STRING,
      permissions: DataTypes.JSONB,
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
