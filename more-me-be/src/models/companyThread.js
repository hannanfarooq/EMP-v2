// In your companyThread.js file
"use strict";

module.exports = (sequelize, DataTypes) => {
  const CompanyThread = sequelize.define(
    "CompanyThread",
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      companyId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      vote: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      heading: {
        type: DataTypes.STRING,
      },
      message: {
        type: DataTypes.TEXT,
      },
      images: {
        type: DataTypes.ARRAY(DataTypes.TEXT),
        defaultValue: [],
      },
    },
    {}
  );

  CompanyThread.associate = function (models) {
    
    CompanyThread.belongsTo(models.User, { foreignKey: "userId" });
    CompanyThread.belongsTo(models.Company, { foreignKey: "companyId" });
  };

  return CompanyThread;
};
