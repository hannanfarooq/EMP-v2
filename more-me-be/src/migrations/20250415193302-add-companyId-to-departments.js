'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Departments', 'companyId', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'Companies', // Make sure this matches your actual table name
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Departments', 'companyId');
  },
};
