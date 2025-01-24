module.exports = (sequelize, DataTypes) => {
    const AnnouncementQuestion = sequelize.define(
      "AnnouncementQuestion",
      {
        question: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        announcementId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: "CompanyAnnouncements", // Foreign key reference to the announcements table
            key: "id",
          },
        },
        options: {
          type: DataTypes.JSON, // Store options for multiple choice questions
          allowNull: true,
          defaultValue: [],
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
  
    AnnouncementQuestion.associate = function (models) {
      // Association with the CompanyAnnouncement model
    
      AnnouncementQuestion.belongsTo(models.CompanyAnnouncement, {
        foreignKey: "announcementId",
        onDelete: "CASCADE",  // This ensures that related AnnouncementQuestions are deleted when the CompanyAnnouncement is deleted.
      });
    };
  
    return AnnouncementQuestion;
  };
  