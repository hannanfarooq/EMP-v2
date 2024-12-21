module.exports = (sequelize, DataTypes) => {
  const Questionnaire = sequelize.define("Questionnaire", {
    questionnaireTitle: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    questionnaireDescription: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    reAttempted: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    isReady: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    isLive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false, // Set default value to false
    },
    companyId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  }, {
    paranoid: true,
    timestamps: true, // Adds createdAt and updatedAt fields
  });

  Questionnaire.associate = function (models) {
    Questionnaire.belongsTo(models.Company, {
      foreignKey: "companyId",
      onDelete: "CASCADE" // Ensures questionnaires are deleted if the company is deleted
    });
  };

  return Questionnaire;
};
