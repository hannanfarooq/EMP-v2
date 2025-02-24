'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    
    
    // Add columns to the Users table
    await queryInterface.addColumn('Messages', 'chatId', {
      type: Sequelize.INTEGER,
      allowNull: true,
     
    });
   
  },

  down: (queryInterface, Sequelize) => queryInterface.dropTable('Messages'),
};
