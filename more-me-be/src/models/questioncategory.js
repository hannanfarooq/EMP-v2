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
