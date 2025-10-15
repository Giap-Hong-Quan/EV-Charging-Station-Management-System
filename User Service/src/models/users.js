"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.UserRole, {
        foreignKey: "user_id",
        as: "roles",
      });
      User.hasMany(models.AuthSession, {
        foreignKey: "user_id",
        as: "sessions",
      });
    }
  }
  User.init(
    {
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      fullName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      socialProvider: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      socialProviderId: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "User",
      tableName: "users",
      underscored: false,
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
  return User;
};
