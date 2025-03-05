"use strict";

module.exports = (sequelize, DataTypes) => {
  const CompanyThread = sequelize.define("CompanyThread", {
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
    parentId: {
      type: DataTypes.INTEGER,
      allowNull: true, // Nullable for root messages (not replies)
      references: {
        model: "CompanyThread", // Self-referential
        key: "id",
      },
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
    videos:{
      type: DataTypes.ARRAY(DataTypes.TEXT),
      defaultValue: [],
    },
    pdfs: {
      type: DataTypes.ARRAY(DataTypes.TEXT),
      defaultValue: [], // Store PDF URLs here
    },
    links: {
      type: DataTypes.ARRAY(DataTypes.TEXT),
      defaultValue: [], // Store external links here
    },
    likes: {
      type: DataTypes.ARRAY(DataTypes.INTEGER),
      defaultValue: [],
    },
    dislikes: {
      type: DataTypes.ARRAY(DataTypes.INTEGER),
      defaultValue: [],
    },
    viewedBy: {
      type: DataTypes.ARRAY(DataTypes.INTEGER),
      defaultValue: [], // Store user IDs of those who have viewed this thread
    },
  }, {});

  CompanyThread.associate = function (models) {
    CompanyThread.belongsTo(models.User, { foreignKey: "userId" });
    CompanyThread.belongsTo(models.Company, { foreignKey: "companyId" });
  };

  return CompanyThread;
};

