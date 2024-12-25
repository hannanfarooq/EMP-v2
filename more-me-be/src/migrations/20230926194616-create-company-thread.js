// In your migration file (e.g., xxxxxxxx-create-company-thread.js)
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('CompanyThreads', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users', // Make sure to use the actual name of your User model
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      companyId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Companies', // Make sure to use the actual name of your Company model
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      vote: {
        type: Sequelize.INTEGER,
        defaultValue: 0 // You can change the default value as needed
      },
      heading: {
        type: Sequelize.STRING // You can adjust the data type as needed
      },
      message: {
        type: Sequelize.TEXT // You can adjust the data type as needed
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
    await queryInterface.dropTable('CompanyThreads');
  }
};
