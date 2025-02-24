'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Conversations', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      chatName: {
        type: Sequelize.STRING,
        allowNull: true,
        trim: true
      },
      isGroupChat: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      users: {
        type: Sequelize.ARRAY(Sequelize.INTEGER),
        allowNull: false
      },
      latestMessageId: {
        type: Sequelize.INTEGER,
       
        allowNull: true
      },
      groupAdminId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          key: 'id'
        },
        allowNull: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Conversations');
  }
};
    