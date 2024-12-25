// models/DailyQuestionWithOptions.js

module.exports = (sequelize, DataTypes) => {
    const DailyQuestionWithOptions = sequelize.define(
      "DailyQuestionWithOptions", {
        questionText: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        companyId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        deletedAt: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        type: {
          type: DataTypes.ENUM(
            "single-choice",
            "dropdown",
            "textfield"
          ),
          defaultValue: "single-choice", // Default type is single-choice
          allowNull: false,
        },
        options: {
          type: DataTypes.ARRAY(DataTypes.STRING), // For 'single-choice' and 'dropdown'
          allowNull: true, // Nullable because textfield does not require options
        },
        placeholder: {
          type: DataTypes.STRING, // For textfield (e.g., a prompt for user input)
          allowNull: true,
        },
      }, {
        paranoid: true, // Soft delete feature
        timestamps: true, // Adds createdAt and updatedAt fields
      }
    );
  
    DailyQuestionWithOptions.associate = function (models) {
      DailyQuestionWithOptions.belongsTo(models.User, { foreignKey: "userId" });
      DailyQuestionWithOptions.belongsTo(models.Company, { foreignKey: "companyId" });
    };
  
    return DailyQuestionWithOptions;
  };  