"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Change "documentUrl" to "documentUrls" and modify its type
    await queryInterface.renameColumn("CompanyAnnouncements", "documentUrl", "documentUrls");
    await queryInterface.changeColumn("CompanyAnnouncements", "documentUrls", {
      type: Sequelize.JSON,
      allowNull: true,
      defaultValue: [],
    });

    // Add a new "imageUrls" field for multiple images
    await queryInterface.addColumn("CompanyAnnouncements", "imageUrls", {
      type: Sequelize.JSON,
      allowNull: true,
      defaultValue: [],
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Revert changes
    await queryInterface.renameColumn("CompanyAnnouncements", "documentUrls", "documentUrl");
    await queryInterface.changeColumn("CompanyAnnouncements", "documentUrl", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    // Remove the "imageUrls" field
    await queryInterface.removeColumn("CompanyAnnouncements", "imageUrls");
  },
};
