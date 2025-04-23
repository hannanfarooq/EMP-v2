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
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: [],
      },
      imageUrls: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: [],
      },
      announcementDate: {
        type: DataTypes.DATE, // Use DATE for correct comparisons
        allowNull: false,
      },
      companyId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      isVisible: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      announcementType: {
        type: DataTypes.ENUM("global", "function", "department", "team"),
        allowNull: false,
      },
      functionId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      departmentId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      teamId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {}
  );

  CompanyAnnouncement.associate = function (models) {
    CompanyAnnouncement.belongsTo(models.Company, { foreignKey: "companyId" });

    CompanyAnnouncement.belongsTo(models.Function, {
      foreignKey: "functionId",
      as: "function",
      onDelete: "SET NULL",
      hooks: true, // Required for cascading updates
    });

    CompanyAnnouncement.belongsTo(models.Department, {
      foreignKey: "departmentId",
      as: "department",
      onDelete: "SET NULL",
      hooks: true,
    });

    CompanyAnnouncement.belongsTo(models.Team, {
      foreignKey: "teamId",
      as: "team",
      onDelete: "SET NULL",
      hooks: true,
    });

    CompanyAnnouncement.hasMany(models.AnnouncementQuestion, {
      foreignKey: "announcementId",
      as: "questions",
    });
  };

  return CompanyAnnouncement;
};
