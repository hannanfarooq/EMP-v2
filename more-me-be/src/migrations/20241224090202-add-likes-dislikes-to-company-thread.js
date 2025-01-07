'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('CompanyThreads', 'likes', {
      type: Sequelize.ARRAY(Sequelize.INTEGER),
      allowNull: true,
      defaultValue: []
    });
    await queryInterface.addColumn('CompanyThreads', 'dislikes', {
      type: Sequelize.ARRAY(Sequelize.INTEGER),
      allowNull: true,
      defaultValue: []
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('CompanyThreads', 'likes');
    await queryInterface.removeColumn('CompanyThreads', 'dislikes');
  }
};
