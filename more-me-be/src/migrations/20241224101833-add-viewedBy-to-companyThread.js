'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('CompanyThreads', 'viewedBy', {
      type: Sequelize.ARRAY(Sequelize.INTEGER),  // This will store an array of userIds
      defaultValue: [],
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('CompanyThreads', 'viewedBy');
  },
};
