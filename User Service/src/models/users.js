"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.belongsTo(models.UserRole, {
        foreignKey: "role_id",
        as: "role",
      });
      User.hasMany(models.AuthSession, {
        foreignKey: "user_id",
        as: "sessions",
      });
    }
  }
  User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      password: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      full_name: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: "full_name",
      },
      address: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      avatar: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      role_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 3,
      },
      station_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      social_provider: {
        type: DataTypes.STRING(50),
        allowNull: true,
        field: "social_provider",
      },
      social_provider_id: {
        type: DataTypes.STRING(255),
        allowNull: true,
        field: "social_provider_id",
      },
    },
    {
      sequelize,
      modelName: "User",
      tableName: "users",
      underscored: true,
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
  return User;
};
