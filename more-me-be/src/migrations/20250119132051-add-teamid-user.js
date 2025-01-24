module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Users', 'teamid', {
      type: Sequelize.INTEGER,
      allowNull: true,  // If it's optional
      references: {
        model: 'Teams', // This is the name of the table you want to reference
        key: 'id',  // Assuming the primary key in the 'Departments' table is 'id'
      },
      onDelete: 'SET NULL',  // This ensures that if a department is deleted, departmentId will be set to null
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Users', 'teamid');
  },
};