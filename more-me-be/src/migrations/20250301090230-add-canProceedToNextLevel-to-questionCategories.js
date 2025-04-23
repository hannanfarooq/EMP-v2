'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add column 'canProceedToNextLevel'
    return queryInterface.addColumn('QuestionCategories', 'canProceedToNextLevel', {
      type: Sequelize.BOOLEAN,
      defaultValue: false,  // Default value set to false (No)
      allowNull: false,     // Can not be null
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Remove column 'canProceedToNextLevel'
    return queryInterface.removeColumn('QuestionCategories', 'canProceedToNextLevel');
  }
};
