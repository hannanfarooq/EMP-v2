'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add foreign key for companyId
    await queryInterface.addColumn('Users', 'companyId', {
      type: Sequelize.INTEGER,
      references: {
        model: 'Companies',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });

    // Add foreign key for teamId
    await queryInterface.addColumn('Users', 'teamId', {
      type: Sequelize.INTEGER,
      references: {
        model: 'Teams',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Remove foreign key for companyId
    await queryInterface.removeColumn('Users', 'companyId');

    // Remove foreign key for teamId
    await queryInterface.removeColumn('Users', 'teamId');
  },
};
