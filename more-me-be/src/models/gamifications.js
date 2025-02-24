module.exports = (sequelize, DataTypes) => {
  const Gamification = sequelize.define("Gamification", {
    text: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    options: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
    },
    correctOption: {
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
    image: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
    },
    media: {
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
        "multiple-img-choice",
        "column-matching"
      ),
      defaultValue: "multiple-choice",
      allowNull: false,
    },
    columnA: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
    },
    columnB: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
    },
    columnMatching: {
      type: DataTypes.JSON,
      allowNull: true,
    },
  }, {
    paranoid: true,
  });

  Gamification.associate = function (models) {
    Gamification.belongsTo(models.Company, { foreignKey: "companyId" });
    Gamification.belongsTo(models.QuestionCategory, {
      foreignKey: "questionCategoryId",
    });
  };

  return Gamification;
};
