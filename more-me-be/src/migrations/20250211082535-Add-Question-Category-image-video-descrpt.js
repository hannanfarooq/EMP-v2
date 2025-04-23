'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('QuestionCategories', 'description', {
      type: Sequelize.TEXT,
      allowNull: true,
    });

    await queryInterface.addColumn('QuestionCategories', 'images', {
      type: Sequelize.JSON, // Stores multiple image URLs as an array
      allowNull: true,
      defaultValue: [],
    });

    await queryInterface.addColumn('QuestionCategories', 'video', {
      type: Sequelize.STRING, // Stores a single video URL
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('QuestionCategories', 'description');
    await queryInterface.removeColumn('QuestionCategories', 'images');
    await queryInterface.removeColumn('QuestionCategories', 'video');
  }
};
