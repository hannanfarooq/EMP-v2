module.exports = (sequelize, DataTypes) => {
  const Department = sequelize.define("Department", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    headId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    functionId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    // companyId: {
    //   type: DataTypes.INTEGER,
    //   allowNull: false,
    // },
  });

  Department.associate = function (models) {
    // Department.belongsTo(models.Company, { foreignKey: "companyId" });
    Department.belongsTo(models.User, { as: "Head", foreignKey: "headId" });
    Department.belongsTo(models.Function, { foreignKey: "functionId" });
  };

  return Department;
};
