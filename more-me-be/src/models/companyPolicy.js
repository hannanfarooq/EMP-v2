// module.exports = (sequelize, DataTypes) => {
//     const CompanyPolicy = sequelize.define(
//       "CompanyPolicy",
//       {
//         name: {
//           type: DataTypes.STRING,
//           allowNull: false,
//         },
//         description: {
//           type: DataTypes.TEXT,
//         },
//         rewardPoints: {
//           type: DataTypes.INTEGER,
//         },
//         documentUrl: {
//           type: DataTypes.STRING,
//           allowNull: true,
//         },
//         companyId: {
//           type: DataTypes.INTEGER,
//           allowNull: false,
//       },
//       },
//       {
//         // Other options
//       }
//     );
  
//     CompanyPolicy.associate = function (models) {
//       CompanyPolicy.belongsTo(models.Company, { foreignKey: "companyId" });
//     };
  
//     return CompanyPolicy;
//   };
  

module.exports = (sequelize, DataTypes) => {
  const CompanyPolicy = sequelize.define(
    "CompanyPolicy",
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
      extractedText: {
        type: DataTypes.BLOB, // Store large amounts of text as a BLOB
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

  CompanyPolicy.associate = function (models) {
    CompanyPolicy.belongsTo(models.Company, { foreignKey: "companyId" });
  };

  return CompanyPolicy;
};
