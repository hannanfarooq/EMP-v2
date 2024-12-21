'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('DynamicQuestionnaires', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      text: {
        type: Sequelize.STRING,
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
      deletedAt: {
        type: Sequelize.DATE,
        allowNull: true,
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
      type: {
        type: Sequelize.ENUM(
          'multiple-choice',
          'single-choice',
          'input',
          'emoji',
          'yes-no',
          'multiple-img-choice'
        ),
        allowNull: false,
        defaultValue: 'multiple-choice',
      },
      options: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: false,
      },
      image: {
        type: Sequelize.STRING,
        allowNull: true,
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
    await queryInterface.dropTable('DynamicQuestionnaires');
  }
};
