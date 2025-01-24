'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Projects', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      departmentid: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      startDate: {
        type: Sequelize.DATEONLY, // Stores only the date (YYYY-MM-DD)
        allowNull: false,
      },
      endDate: {
        type: Sequelize.DATEONLY, // Stores only the date (YYYY-MM-DD)
        allowNull: false,
      },
      projectLead: {
        type: Sequelize.INTEGER, // Store a single user ID for the project lead
        allowNull: false,
      },
      projectAdministrator: {
        type: Sequelize.INTEGER, // Store a single user ID for the project administrator
        allowNull: true, // Optional
      },
      projectTeam: {
        type: Sequelize.ARRAY(Sequelize.INTEGER), // Array of integers to store user IDs
        allowNull: true, // Optional
        defaultValue: [], // Default to an empty array
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Projects');
  },
};
