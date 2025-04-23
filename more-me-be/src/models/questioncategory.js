module.exports = (sequelize, DataTypes) => {
  const QuestionCategory = sequelize.define(
    "QuestionCategory",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      img: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      companyId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      gameid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Games",
          key: "id",
        },
      },
      subCategoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "SubCategories",
          key: "id",
        },
      },
      images: {
        type: DataTypes.JSON, // Stores multiple image URLs as an array
        allowNull: true,
        defaultValue: [],
      },
      description: {
        type: DataTypes.STRING, // Stores a single video URL
        allowNull: false,
      },
      video: {
        type: DataTypes.STRING, // Stores a single video URL
        allowNull: true,
      },
      locked: {
        type: DataTypes.ARRAY(DataTypes.INTEGER), // Lock/unlock the category
        defaultValue: [],
      },
      starting: {
        type: DataTypes.BOOLEAN, // Lock/unlock the category
        defaultValue: false,
      },
      canProceedToNextLevel: {
        type: DataTypes.BOOLEAN, // Determines if the game can proceed to the next level
        defaultValue: false,     // Default to false (No, the game cannot proceed)
      },
    },
  );

  QuestionCategory.associate = (models) => {
    QuestionCategory.belongsTo(models.Company, {
      foreignKey: 'companyId',
      as: 'company',
    });
    QuestionCategory.belongsTo(models.SubCategory, {
      foreignKey: "subCategoryId",
      as: "subCategory",
    });
    QuestionCategory.hasMany(models.Gamification, {
      foreignKey: "questionCategoryId",
      as: "gamifications",
    });
  };

  return QuestionCategory;
};
