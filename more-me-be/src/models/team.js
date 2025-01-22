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
    userIds: { // New field to store array of user IDs
      type: DataTypes.ARRAY(DataTypes.INTEGER),
      allowNull: true,
    },
  });

  Team.associate = function (models) {
    Team.belongsTo(models.User, { as: "Lead", foreignKey: "leadId" });
   
    Team.belongsTo(models.Department, { foreignKey: "departmentId", as: "department" });
    // Association with users (optional: this is to easily get all users in the team)
    Team.belongsToMany(models.User, {
      through: "UserTeam", // through a junction table for many-to-many relation
      foreignKey: "teamId",
      otherKey: "userId",
    });
  };

  return Team;
};
