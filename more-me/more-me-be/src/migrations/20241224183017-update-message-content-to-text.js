'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Messages', 'content', {
      type: Sequelize.TEXT,  // Change the column type to TEXT
      allowNull: false,      // Ensure that the field is not nullable
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Revert the change back to STRING if needed
    await queryInterface.changeColumn('Messages', 'content', {
      type: Sequelize.STRING,  // Revert back to STRING type
      allowNull: false,
    });
  }
};
