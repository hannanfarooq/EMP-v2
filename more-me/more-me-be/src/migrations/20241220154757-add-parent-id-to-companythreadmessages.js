"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("CompanyThreads", "parentId", {
      type: Sequelize.INTEGER,
      allowNull: true, // Parent ID can be null for root messages
      references: {
        model: "CompanyThreads", // Reference the same table
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL", // If a parent is deleted, set parentId to NULL
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("CompanyThreads", "parentId");
  },
};
