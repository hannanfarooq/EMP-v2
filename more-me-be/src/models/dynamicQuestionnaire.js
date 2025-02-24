module.exports = (sequelize, DataTypes) => {
  const DynamicQuestionnaire = sequelize.define("DynamicQuestionnaire", {
    text: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    companyId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    deletedAt: {
      type: DataTypes.DATE,
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
    type: {
      type: DataTypes.ENUM(
        "multiple-choice",
        "single-choice",
        "input",
        "emoji",
        "yes-no",
        "multiple-img-choice"
      ),
      defaultValue: "multiple-choice",
      allowNull: false,
    },
    options: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  }, {
    paranoid: true,
    timestamps: true, // Adds createdAt and updatedAt fields
  });

  DynamicQuestionnaire.associate = function (models) {
    DynamicQuestionnaire.belongsTo(models.Questionnaire, {
      foreignKey: "questionnaireId",
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });
    DynamicQuestionnaire.belongsTo(models.Company, { foreignKey: "companyId" });
  };

  return DynamicQuestionnaire;
};