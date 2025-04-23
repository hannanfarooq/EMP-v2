module.exports = (sequelize, DataTypes) => {
    const Category = sequelize.define("Category", {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      companyId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      }
    });
  
    Category.associate = (models) => {
      Category.hasMany(models.SubCategory, {
        foreignKey: "categoryId",
        as: "subCategories",
      });
      Category.belongsTo(models.Company, {
        foreignKey: "companyId",
        as: "company",
      });
    };
  
    return Category;
  };
  