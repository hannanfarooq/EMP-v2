module.exports = (sequelize, DataTypes) => {
    const Podcasts = sequelize.define("Podcasts", {
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
  
    return Podcasts;
  };
  