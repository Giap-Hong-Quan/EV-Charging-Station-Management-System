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
      role_name: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true,
      },
      description: {
        type: Sequelize.STRING(255),
        allowNull: true,
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

    // Sử dụng raw query để insert dữ liệu JSON
    await queryInterface.sequelize.query(`
      INSERT INTO user_roles (id, role_name, description, permissions, created_at, updated_at) VALUES
      (1, 'admin', 'Quản trị viên hệ thống', '{"can_manage_users": true, "can_manage_stations": true, "can_view_reports": true, "can_manage_roles": true}', NOW(), NOW()),
      (2, 'staff', 'Nhân viên', '{"can_manage_stations": true, "can_view_reports": true, "can_manage_orders": true}', NOW(), NOW()),
      (3, 'driver', 'Tài xế', '{"can_view_orders": true, "can_update_status": true, "can_view_assigned_orders": true}', NOW(), NOW())
    `);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("user_roles");
  },
};
