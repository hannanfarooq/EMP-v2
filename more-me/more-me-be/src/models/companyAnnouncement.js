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
        documentUrl: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        announcementDate: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        companyId: {
          type: DataTypes.INTEGER,
          allowNull: false,
      },
      },
      {
        // Other options
      }
    );
  
    CompanyAnnouncement.associate = function (models) {
      CompanyAnnouncement.belongsTo(models.Company, { foreignKey: "companyId" });
    };
  
    return CompanyAnnouncement;
  };
  