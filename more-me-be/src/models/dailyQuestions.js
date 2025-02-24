module.exports = (sequelize, DataTypes) => {
    const DailyQuestions = sequelize.define(
      "DailyQuestions",
      {
        userId:{
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        companyId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        firstName: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        lastName: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        email: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        feeling: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        anxietyLevel: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        reason: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        symptom: {
            type: DataTypes.STRING,
            allowNull: false,
        }
      },
      {
        // Other options
      }
    );
  
    DailyQuestions.associate = function (models) {

    DailyQuestions.belongsTo(models.User, { foreignKey: "userId" });
    DailyQuestions.belongsTo(models.Company, { foreignKey: "companyId" });
    };
  
    return DailyQuestions;
  };
  