'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('QuestionCategories', 'locked', {
      type: Sequelize.ARRAY(Sequelize.INTEGER), // Array of integers for storing locked users
      defaultValue: [], // Default to an empty array
    });

    await queryInterface.addColumn('QuestionCategories', 'starting', {
      type: Sequelize.BOOLEAN, // Boolean field for starting status
      defaultValue: false, // Default to false
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('QuestionCategories', 'locked');
    await queryInterface.removeColumn('QuestionCategories', 'starting');
  },
};
