module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("QuestionCategories", "subCategoryId", {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "SubCategories",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("QuestionCategories", "subCategoryId");
  },
};
