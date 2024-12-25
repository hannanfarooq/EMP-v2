"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add pdfs column
    await queryInterface.addColumn("CompanyThreads", "pdfs", {
      type: Sequelize.ARRAY(Sequelize.TEXT),
      defaultValue: [],
    });

    // Add links column
    await queryInterface.addColumn("CompanyThreads", "links", {
      type: Sequelize.ARRAY(Sequelize.TEXT),
      defaultValue: [],
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Remove pdfs column
    await queryInterface.removeColumn("CompanyThreads", "pdfs");

    // Remove links column
    await queryInterface.removeColumn("CompanyThreads", "links");
  }
};
