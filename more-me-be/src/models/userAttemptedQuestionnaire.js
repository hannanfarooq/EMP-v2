module.exports = (sequelize, DataTypes) => {
    const UserAttemptedQuestionnaire = sequelize.define("UserAttemptedQuestionnaire", {
      companyId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      deletedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      questionnaire: {
        type: DataTypes.JSON,
        defaultValue: {},
        allowNull: true,
      },
      questionnaireId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "Questionnaires", // Ensure this matches the actual table name
          key: "id",
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
    }, {
      paranoid: true,
      timestamps: true, // Adds createdAt and updatedAt fields
    });

    UserAttemptedQuestionnaire.associate = function (models) {
        UserAttemptedQuestionnaire.belongsTo(models.Company, { foreignKey: "companyId" });
        UserAttemptedQuestionnaire.belongsTo(models.User, { foreignKey: "userId" });
        UserAttemptedQuestionnaire.belongsTo(models.Questionnaire, { foreignKey: "questionnaireId" });
    };

    return UserAttemptedQuestionnaire;
};