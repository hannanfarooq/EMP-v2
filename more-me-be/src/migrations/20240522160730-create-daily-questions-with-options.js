// migrations/xxxxxx-create-daily-question-with-options.js

module.exports = {
    up: async (queryInterface, Sequelize) => {
      await queryInterface.createTable('DailyQuestionWithOptions', {
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        questionText: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        companyId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'Companies', // Ensure this matches the actual table name
            key: 'id',
          },
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
        },
        deletedAt: {
          type: Sequelize.DATE,
          allowNull: true,
        },
        type: {
          type: Sequelize.ENUM(
            "single-choice",
            "dropdown",
            "textfield"
          ),
          defaultValue: "single-choice", // Default type is single-choice
          allowNull: false,
        },
        options: {
          type: Sequelize.ARRAY(Sequelize.STRING),
          allowNull: true, // Nullable for textfield type
        },
        placeholder: {
          type: Sequelize.STRING, // Placeholder for textfield type
          allowNull: true,
        },
        userId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'Users', // Ensure this matches the actual table name for users
            key: 'id',
          },
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
        },
        createdAt: {
          type: Sequelize.DATE,
          defaultValue: Sequelize.NOW,
        },
        updatedAt: {
          type: Sequelize.DATE,
          defaultValue: Sequelize.NOW,
        },
      });
    },
  
    down: async (queryInterface, Sequelize) => {
      await queryInterface.dropTable('DailyQuestionWithOptions');
    }
  };