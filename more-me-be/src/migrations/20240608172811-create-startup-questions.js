'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('StartUpQuestions', {
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
          model: 'Users', // Name of the target model
          key: 'id', // Key in the target model
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      companyId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Companies', // Name of the target model
          key: 'id', // Key in the target model
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      authorName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      bookTitle: {
        type: Sequelize.STRING,
        allowNull: false
      },
      engagementMethod: {
        type: Sequelize.STRING,
        allowNull: true
      },
      hobbies: {
        type: Sequelize.STRING, // Storing as comma-separated string
        allowNull: false
      },
      interestTopics: {
        type: Sequelize.STRING, // Storing as comma-separated string
        allowNull: false
      },
      lifePrincipleInspirations: {
        type: Sequelize.STRING, // Storing as comma-separated string
        allowNull: false
      },
      personalityType: {
        type: Sequelize.STRING,
        allowNull: false
      },
      readingPreference: {
        type: Sequelize.STRING,
        allowNull: false
      },
      relaxationActivities: {
        type: Sequelize.STRING, // Storing as comma-separated string
        allowNull: false
      },
      contentPreferences: {
        type: Sequelize.STRING, // Storing as comma-separated string
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('StartUpQuestions');
  }
};
