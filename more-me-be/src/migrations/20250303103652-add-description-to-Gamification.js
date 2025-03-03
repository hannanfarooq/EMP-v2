'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Gamifications', 'description', {
      type: Sequelize.TEXT,
      allowNull: true,
      defaultValue: "", // Store points per option as a key-value object
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Gamifications', 'description');
  }
};
