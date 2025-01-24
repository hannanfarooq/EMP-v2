"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
   

    // Add a new "imageUrls" field for multiple images
    await queryInterface.addColumn("CompanyAnnouncements", "isVisible", {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true, 
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Revert changes
   
    // Remove the "imageUrls" field
    await queryInterface.removeColumn("CompanyAnnouncements", "isVisible");
  },
};
