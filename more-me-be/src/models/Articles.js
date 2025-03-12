module.exports = (sequelize, DataTypes) => {
    const Article = sequelize.define("Article", {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      urls: {
        type: DataTypes.JSON, // Stores multiple URLs
        allowNull: false,
      },
     
    }, {
      timestamps: true, // Enables automatic createdAt and updatedAt handling
    });
  
    return Article;
  };
  