// In your threadMessage.js file
"use strict";

module.exports = (sequelize, DataTypes) => {
  const ThreadMessage = sequelize.define(
    "ThreadMessage",
    {
      companyThreadId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      heading: {
        type: DataTypes.STRING,
      },
      message: {
        type: DataTypes.TEXT,
      },
    },
    {}
  );

  ThreadMessage.associate = function (models) {
    ThreadMessage.belongsTo(models.CompanyThread, {
        foreignKey: "companyThreadId",
      });
    ThreadMessage.belongsTo(models.User, { foreignKey: "userId" });
  };

  return ThreadMessage;
};
