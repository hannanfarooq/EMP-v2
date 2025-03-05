"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add pdfs column
    await queryInterface.addColumn("CompanyThreads", "videos", {
      type: Sequelize.ARRAY(Sequelize.TEXT),
      defaultValue: [],
    });

    // Add links column
   
  },

  down: async (queryInterface, Sequelize) => {
    // Remove pdfs column
    await queryInterface.removeColumn("CompanyThreads", "videos");

    // Remove links column
   
  }
};
