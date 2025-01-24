module.exports = (sequelize, DataTypes) => {
  const CompanyAnnouncement = sequelize.define(
    "CompanyAnnouncement",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
      },
      rewardPoints: {
        type: DataTypes.INTEGER,
      },
      documentUrls: {
        // Updated field to allow multiple files
        type: DataTypes.JSON,
        allowNull: true, // Optional
        defaultValue: [], // Default to an empty array
      },
      imageUrls: {
        // New field for multiple images
        type: DataTypes.JSON,
        allowNull: true, // Optional
        defaultValue: [], // Default to an empty array
      },
      announcementDate: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      companyId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      isVisible: {
        type: DataTypes.BOOLEAN, // Boolean field to control visibility
        allowNull: false,
        defaultValue: true, // Default is true, meaning the question is visible
      },
    },
    {
      // Additional options can go here
    }
  );

  CompanyAnnouncement.associate = function (models) {
    CompanyAnnouncement.hasMany(models.AnnouncementQuestion, { 
      foreignKey: "announcementId",  // Assuming "announcementId" is the key in the AnnouncementQuestion model
      as: "questions", // Alias to use when including in queries
      
    });
    CompanyAnnouncement.belongsTo(models.Company, { foreignKey: "companyId" });
  };

  return CompanyAnnouncement;
};
