'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('TaskChat', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      taskId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Task', // Name of the referenced table
          key: 'id', // Column in the Task table
        },
        onDelete: 'CASCADE', // Ensures task chat is deleted if the associated task is deleted
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users', // Name of the referenced table
          key: 'id', // Column in the User table
        },
        onDelete: 'CASCADE', // Ensures chat messages are deleted if the associated user is deleted
      },
      message: {
        type: Sequelize.TEXT,
        allowNull: true, // Optional for text messages
      },
      imageUrl: {
        type: Sequelize.TEXT,
        allowNull: true, // Optional for image URLs
      },
      attachmentUrl: {
        type: Sequelize.TEXT,
        allowNull: true, // Optional for attachment URLs
      },
      link: {
        type: Sequelize.TEXT,
        allowNull: true, // Optional for shared links
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('TaskChat');
  },
};
