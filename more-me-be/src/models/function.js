module.exports = (sequelize, DataTypes) => {
  const Function = sequelize.define("Function", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    headId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    companyId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });

  Function.associate = function (models) {
    Function.belongsTo(models.User, { as: "Head", foreignKey: "headId" });
    Function.belongsTo(models.Company, { foreignKey: "companyId" });
  };

  return Function;
};
