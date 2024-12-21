'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('UserAttemptedQuestionnaires', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      companyId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Companies', // assumes the table name is 'Companies'
          key: 'id',
        },
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users', // assumes the table name is 'Users'
          key: 'id',
        },
      },
      deletedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      questionnaire: {
        type: Sequelize.JSON,
        allowNull: true,
        defaultValue: {},
      },
      questionnaireId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Questionnaires', // assumes the table name is 'Questionnaires'
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
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
    await queryInterface.dropTable('UserAttemptedQuestionnaires');
  }
};
