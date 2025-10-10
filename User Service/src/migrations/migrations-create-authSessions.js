"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("auth_sessions", {
      token: {
        type: Sequelize.STRING(255),
        primaryKey: true,
        allowNull: false,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      expires_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });

    // Thêm index cho expires_at để dễ dọn dẹp token hết hạn
    await queryInterface.addIndex("auth_sessions", ["expires_at"], {
      name: "auth_sessions_expires_at_index",
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeIndex(
      "auth_sessions",
      "auth_sessions_expires_at_index"
    );
    await queryInterface.dropTable("auth_sessions");
  },
};
