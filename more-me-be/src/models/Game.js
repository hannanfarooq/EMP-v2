module.exports = (sequelize, DataTypes) => {
    const Game = sequelize.define("Game", {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
     
      subCategoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "SubCategories",
          key: "id",
        },
      },
    });
  
    Game.associate = (models) => {
      // Game belongs to a SubCategory
      Game.belongsTo(models.SubCategory, {
        foreignKey: "subCategoryId",
        as: "subCategory",
      });
    };
  
    return Game;
  };
  