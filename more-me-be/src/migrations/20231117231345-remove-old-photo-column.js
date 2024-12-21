'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('buyAndSells', 'photo');
    await queryInterface.renameColumn('buyAndSells', 'newPhoto', 'photo');
  },

  down: async (queryInterface, Sequelize) => {
    // Implement the reverse migration if needed
  },
};
