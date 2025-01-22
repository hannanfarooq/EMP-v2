"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Step 1: Add a new "documentUrlsTemp" column with JSON type
    await queryInterface.addColumn("CompanyAnnouncements", "documentUrlsTemp", {
      type: Sequelize.JSON,
      allowNull: true,
      defaultValue: [],
    });

    // Step 2: Copy data from "documentUrls" to "documentUrlsTemp" if it's in a compatible format
    // This step depends on your data; if the old "documentUrls" column is a string representation of JSON, you can try updating it
    await queryInterface.sequelize.query(`
      UPDATE "CompanyAnnouncements"
      SET "documentUrlsTemp" = "documentUrls"::JSON;
    `);

    // Step 3: Drop the old "documentUrls" column
    await queryInterface.removeColumn("CompanyAnnouncements", "documentUrls");

    // Step 4: Rename "documentUrlsTemp" to "documentUrls"
    await queryInterface.renameColumn("CompanyAnnouncements", "documentUrlsTemp", "documentUrls");

    // Add a new "imageUrls" field for multiple images
   
  },

  down: async (queryInterface, Sequelize) => {
    // Revert the changes in "documentUrls" back to STRING (assuming it was a string before)
    await queryInterface.changeColumn("CompanyAnnouncements", "documentUrls", {
      type: Sequelize.STRING,
      allowNull: true,
    });

   
  },
};
