module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Games", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      subCategoryId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "SubCategories", // Reference to SubCategories table
          key: "id", // Referencing the 'id' column of SubCategories
        },
        onUpdate: "CASCADE", // Optional: updates the foreign key if SubCategory's id changes
        onDelete: "CASCADE", // Optional: deletes all games when the corresponding SubCategory is deleted
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Games");
  },
};
