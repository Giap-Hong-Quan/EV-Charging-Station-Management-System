"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("user_roles", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
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
      role: {
        type: Sequelize.ENUM("admin", "driver", "customer"),
        allowNull: false,
        defaultValue: "driver",
      },
      permissions: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("NOW"),
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("NOW"),
      },
    });

    await queryInterface.addIndex("user_roles", ["user_id"], {
      name: "user_roles_user_id_index",
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeIndex("user_roles", "user_roles_user_id_index");
    await queryInterface.dropTable("user_roles");
  },
};
