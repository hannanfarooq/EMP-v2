'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('SubTaskHistory', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      subTaskId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'SubTask', // Name of the referenced table
          key: 'id', // Column in the SubTask table
        },
        onDelete: 'CASCADE', // Deletes history when the related subtask is deleted
      },
      createdBy: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users', // Name of the referenced table
          key: 'id', // Column in the User table
        },
      },
      changeHistory: {
        type: Sequelize.JSON, // JSON to store modification details
        allowNull: true,
        defaultValue: [],
      },
      creationDate: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      lastModifiedDate: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: Sequelize.NOW,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('SubTaskHistory');
  }
};
