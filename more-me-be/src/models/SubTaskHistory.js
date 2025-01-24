'use strict';
module.exports = (sequelize, DataTypes) => {
  const SubTaskHistory = sequelize.define(
    'SubTaskHistory',
    {
      subTaskId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'subtasks', // Assuming you have a 'subtasks' table
          key: 'id',
        },
      },
      createdBy: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'users', // Assuming you have a 'users' table
          key: 'id',
        },
      },
      changeHistory: {
        type: DataTypes.JSON, // JSON array to store modification details
        allowNull: true,
        defaultValue: [],
      },
      creationDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      lastModifiedDate: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: 'SubTaskHistory',
      timestamps: true, // Automatically adds createdAt and updatedAt fields
    }
  );

  SubTaskHistory.associate = (models) => {
    // Associate SubTaskHistory with SubTask
    SubTaskHistory.belongsTo(models.SubTask, {
      foreignKey: 'subTaskId', // Foreign key to the SubTask model
      as: 'subTask', // Alias for the relation
    });

    // Associate SubTaskHistory with User (createdBy)
    SubTaskHistory.belongsTo(models.User, {
      foreignKey: 'createdBy',
      as: 'user', // Alias for the user who made the change
    });
  };

  return SubTaskHistory;
};
