module.exports = (sequelize, DataTypes) => {
    const SubCategory = sequelize.define("SubCategory", {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      categoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Categories",
          key: "id",
        },
      },
      companyId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      }
    });
  
    SubCategory.associate = (models) => {
      SubCategory.belongsTo(models.Category, {
        foreignKey: "categoryId",
        as: "category",
      });
  
      SubCategory.hasMany(models.QuestionCategory, {
        foreignKey: "subCategoryId",
        as: "questionCategories",
      });
      SubCategory.belongsTo(models.Company, {
        foreignKey: "companyId",
        as: "company",
      });
    };
  
    return SubCategory;
  };
  