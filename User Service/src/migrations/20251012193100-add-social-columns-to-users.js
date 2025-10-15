"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const table = await queryInterface.describeTable("users");

    if (!table["socialProvider"]) {
      await queryInterface.addColumn("users", "socialProvider", {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }

    if (!table["socialProviderId"]) {
      await queryInterface.addColumn("users", "socialProviderId", {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    const table = await queryInterface.describeTable("users");

    if (table["socialProviderId"]) {
      await queryInterface.removeColumn("users", "socialProviderId");
    }
    if (table["socialProvider"]) {
      await queryInterface.removeColumn("users", "socialProvider");
    }
  },
};
