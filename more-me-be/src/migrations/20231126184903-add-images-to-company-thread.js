

"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add the 'images' column with type ARRAY(TEXT)
    await queryInterface.addColumn("CompanyThreads", "images", {
      type: Sequelize.ARRAY(Sequelize.TEXT),
      defaultValue: [], // You can set a default value if needed
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Remove the 'images' column
    await queryInterface.removeColumn("CompanyThreads", "images");
  },
};
