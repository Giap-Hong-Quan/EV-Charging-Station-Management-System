"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class AuthSession extends Model {
    static associate(models) {
      // Mỗi auth session thuộc về một user
      AuthSession.belongsTo(models.User, {
        foreignKey: "user_id",
        as: "user",
      });
    }
  }

  AuthSession.init(
    {
      token: {
        type: DataTypes.STRING(255),
        primaryKey: true,
        allowNull: false,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      expires_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "AuthSession",
      tableName: "auth_sessions",
      underscored: true,
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  return AuthSession;
};
