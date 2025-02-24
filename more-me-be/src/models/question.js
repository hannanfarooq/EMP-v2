module.exports = (sequelize, DataTypes) => {
  const Question = sequelize.define("Question", {
    text: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    options: {
      type: DataTypes.ARRAY(DataTypes.STRING),
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
    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    questionCategoryId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "QuestionCategories",
        key: "id",
      },
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
  }, {
    paranoid: true,
  });
  Question.associate = function (models) {
    Question.belongsTo(models.Company, { foreignKey: "companyId" });
    Question.belongsTo(models.QuestionCategory, {
      foreignKey: "questionCategoryId",
    });
  };

  return Question;
};
