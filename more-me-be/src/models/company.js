// src/models/company.js
module.exports = (sequelize, DataTypes) => {
  const Company = sequelize.define(
    "Company",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
      },
      logo: {
        type: DataTypes.STRING,
      },
      photo: {
        type: DataTypes.STRING,
      },
      adminId: {
        type: DataTypes.ARRAY(DataTypes.INTEGER),
        //allowNull: false,
      },
      ntn: {
        type: DataTypes.STRING,
      },
      postalAddress: {
        type: DataTypes.STRING,
      },
      city: {
        type: DataTypes.STRING,
      },
      country: {
        type: DataTypes.STRING,
      },
      telephone: {
        type: DataTypes.STRING,
      },
      companyEmail: {
        type: DataTypes.STRING,
        validate: {
          isEmail: true,
        },
      },
      userLimit: {
        type: DataTypes.INTEGER,
      },
    },
    {
      // Other options
    }
  );

  Company.associate = function (models) {
    Company.belongsTo(models.User, { as: "admin", foreignKey: "adminId" });
  };

  return Company;
};