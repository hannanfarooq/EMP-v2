'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('CompanyPolicies', 'extractedText', {
      type: Sequelize.BLOB, // Define as BLOB for large text storage
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('CompanyPolicies', 'extractedText');
  },
};
