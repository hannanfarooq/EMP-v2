module.exports = (sequelize, DataTypes) => {
  const StartUpQuestions = sequelize.define('StartUpQuestions', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    companyId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    authorName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    bookTitle: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    engagementMethod: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    hobbies: {
      type: DataTypes.STRING, // Storing as comma-separated string
      allowNull: false,
    },
    interestTopics: {
      type: DataTypes.STRING, // Storing as comma-separated string
      allowNull: false,
    },
    lifePrincipleInspirations: {
      type: DataTypes.STRING, // Storing as comma-separated string
      allowNull: false,
    },
    personalityType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    readingPreference: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    relaxationActivities: {
      type: DataTypes.STRING, // Storing as comma-separated string
      allowNull: false,
    },
    contentPreferences: {
      type: DataTypes.STRING, // Storing as comma-separated string
      allowNull: false,
    },
  }, {});

  StartUpQuestions.associate = function(models) {
    StartUpQuestions.belongsTo(models.User, { foreignKey: 'userId' });
    StartUpQuestions.belongsTo(models.Company, { foreignKey: 'companyId' });
  };

  return StartUpQuestions;
};