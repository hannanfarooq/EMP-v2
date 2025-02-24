'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Users', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      firstName: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      lastName: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      profilePic: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      resetToken: {
        type: Sequelize.STRING,
        defaultValue: null,
        allowNull: true,
      },
      resetTokenExpires: {
        type: Sequelize.DATE,
        defaultValue: null,
        allowNull: true,
      },
      userRewards: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      readPolicies: {
        type: Sequelize.ARRAY(Sequelize.INTEGER),
        allowNull: true,
      },
      verifyToken: {
        type: Sequelize.STRING,
        defaultValue: null,
        allowNull: true,
      },
      questionnaire: {
        type: Sequelize.JSON,
        defaultValue: {},
        allowNull: true,
      },
      dailyQuestionsithOptions: {
        type: Sequelize.JSON,
        defaultValue: {},
        allowNull: true,
      },
      // gamification: {
      //   type: Sequelize.JSON,
      //   defaultValue: {},
      //   allowNull: true,
      // },
      // points: {
      //   type: Sequelize.INTEGER,
      //   defaultValue: 0,
      //   allowNull: true,
      // },
      isVerified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      isAdmin: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      role: {
        type: Sequelize.ENUM(
          'super-super-admin',
          'admin',
          'manager',
          'lead', 
          'user',
          'company-super-admin'
        ),
        defaultValue: 'user',
      },
      is_function_head: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: true,
      },
      is_department_head: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: true,
      },
      is_team_lead: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: true,
      },
      ageRange: {
        type: Sequelize.ENUM('18-24', '25-34', '35-44', '45-54', '55-64', '65+'),
        allowNull: true,
      },
      childrenDOBs: {
        type: Sequelize.ARRAY(Sequelize.DATE),
        allowNull: true,
      },
      childrenNames: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: true,
      },
      dateOfBirth: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      gender: {
        type: Sequelize.ENUM('male', 'female', 'other'),
        allowNull: true,
      },
      hasChild: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: true,
      },
      numChildren: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: true,
      },
      spouseName: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      spouseDOB: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      address: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      city: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      country: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      phoneNumber: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('now'),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('now'),
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Users');

    // Drop the ENUM types if no longer used
    await queryInterface.sequelize.query(`
      DO $$ DECLARE
      r RECORD;
      BEGIN
        IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_Users_role') THEN
          DROP TYPE "enum_Users_role";
        END IF;
        IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_Users_ageRange') THEN
          DROP TYPE "enum_Users_ageRange";
        END IF;
        IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_Users_gender') THEN
          DROP TYPE "enum_Users_gender";
        END IF;
      END $$;
    `);
  },
};
