'use strict';
module.exports = (sequelize, DataTypes) => {
  const Project = sequelize.define(
    'Project',
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      departmentid: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    
      startDate: {
        type: DataTypes.DATEONLY, // Stores only the date (YYYY-MM-DD)
        allowNull: false,
      },
      endDate: {
        type: DataTypes.DATEONLY, // Stores only the date (YYYY-MM-DD)
        allowNull: false,
      },
      projectLead: {
        type: DataTypes.INTEGER, // Store a single user ID for the project lead
        allowNull: false,
      },
      projectAdministrator: {
        type: DataTypes.INTEGER, // Store a single user ID for the project administrator
        allowNull: true, // Optional
      },
      projectTeam: {
        type: DataTypes.ARRAY(DataTypes.INTEGER), // Array of integers to store user IDs
        allowNull: true, // Optional
        defaultValue: [], // Default to an empty array
      },
    },
    {
      timestamps: true, // Adds createdAt and updatedAt fields
    }
  );

  return Project;
};
