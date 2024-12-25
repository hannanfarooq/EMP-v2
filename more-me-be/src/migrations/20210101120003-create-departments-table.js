'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Create the Departments table
    await queryInterface.createTable('Departments', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      headId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Users', // Name of the target table
          key: 'id', // Key in the target table that is being referenced
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      functionId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Functions', // Name of the target table
          key: 'id', // Key in the target table that is being referenced
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('now'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('now'),
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Drop the Departments table
    await queryInterface.dropTable('Departments');
  },
};
