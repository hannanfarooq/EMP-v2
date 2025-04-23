module.exports = (sequelize, DataTypes) => {
    const Videos = sequelize.define("Videos", {
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
  
    return Videos;
  };
  