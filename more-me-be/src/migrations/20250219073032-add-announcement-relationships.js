module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add fields to the `CompanyAnnouncement` model
    return Promise.all([
      queryInterface.addColumn("CompanyAnnouncements", "functionId", {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "Functions", // Assuming your `Functions` table name is "Functions"
          key: "id",
        },
      }),

      queryInterface.addColumn("CompanyAnnouncements", "departmentId", {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "Departments", // Assuming your `Departments` table name is "Departments"
          key: "id",
        },
      }),

      queryInterface.addColumn("CompanyAnnouncements", "teamId", {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "Teams", // Assuming your `Teams` table name is "Teams"
          key: "id",
        },
      }),

      queryInterface.addColumn("CompanyAnnouncements", "announcementType", {
        type: Sequelize.ENUM("global", "function", "department", "team"),
        allowNull: false,
      }),

      // Add Foreign Key constraints
      queryInterface.addConstraint("CompanyAnnouncements", {
        fields: ["functionId"],
        type: "foreign key",
        name: "fk_function_id",
        references: {
          table: "Functions",
          field: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      }),

      queryInterface.addConstraint("CompanyAnnouncements", {
        fields: ["departmentId"],
        type: "foreign key",
        name: "fk_department_id",
        references: {
          table: "Departments",
          field: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      }),

      queryInterface.addConstraint("CompanyAnnouncements", {
        fields: ["teamId"],
        type: "foreign key",
        name: "fk_team_id",
        references: {
          table: "Teams",
          field: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      }),
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    // Remove the added columns and constraints
    return Promise.all([
      queryInterface.removeColumn("CompanyAnnouncements", "functionId"),
      queryInterface.removeColumn("CompanyAnnouncements", "departmentId"),
      queryInterface.removeColumn("CompanyAnnouncements", "teamId"),
      queryInterface.removeColumn("CompanyAnnouncements", "announcementType"),

      queryInterface.removeConstraint("CompanyAnnouncements", "fk_function_id"),
      queryInterface.removeConstraint("CompanyAnnouncements", "fk_department_id"),
      queryInterface.removeConstraint("CompanyAnnouncements", "fk_team_id"),
    ]);
  },
};
