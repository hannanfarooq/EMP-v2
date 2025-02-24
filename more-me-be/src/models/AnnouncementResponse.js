module.exports = (sequelize, DataTypes) => {
  const AnnouncementResponse = sequelize.define(
    "AnnouncementResponse",
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
      },
      questionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "AnnouncementQuestions",
          key: "id",
        },
      },
      response: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      // Additional options can go here
    }
  );

  AnnouncementResponse.associate = function (models) {
    // Association with the AnnouncementQuestion model
    AnnouncementResponse.belongsTo(models.AnnouncementQuestion, {
      foreignKey: "questionId",
      onDelete: "CASCADE", // Ensures responses are deleted when the question is deleted
    });

    // Association with the User model
    AnnouncementResponse.belongsTo(models.User, {
      foreignKey: "userId",
    });
  };

  return AnnouncementResponse;
};
