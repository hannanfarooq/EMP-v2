module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("Teams", "userIds", {
      type: Sequelize.ARRAY(Sequelize.INTEGER),
      allowNull: true, // This can be set to false if you want to enforce users in the team
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("Teams", "userIds");
  },
};
