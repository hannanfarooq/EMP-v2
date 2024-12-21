module.exports = (sequelize, DataTypes) => {
  const Team = sequelize.define("Team", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    leadId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    departmentId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  });

  Team.associate = function (models) {
    Team.belongsTo(models.User, { as: "Lead", foreignKey: "leadId" });
    Team.belongsTo(models.Department, { foreignKey: "departmentId" });
  };

  return Team;
};
