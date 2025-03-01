'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('QuestionCategories', 'gameid', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "Games", 
        key: "id",
      },
    });

   
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('QuestionCategories', 'gameid');
  
  }
};
