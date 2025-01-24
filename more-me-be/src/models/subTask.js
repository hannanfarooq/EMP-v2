'use strict';
module.exports = (sequelize, DataTypes) => {
  const SubTask = sequelize.define(
    'SubTask',
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false, // Title is required
      },
      description: {
        type: DataTypes.TEXT, // Optional longer text for subtask details
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM('Pending', 'In Progress', 'Completed'), // Example statuses
        defaultValue: 'Pending', // Default status
      },
      taskId: {
        type: DataTypes.INTEGER, // Foreign key from Task table
        allowNull: false,
        references: {
          model: 'Task', // Name of the referenced table
          key: 'id', // Column in the Task table
        },
      },
      assignedTo: {
        type: DataTypes.INTEGER, // Foreign key for the user assigned to the subtask
        allowNull: true, // Can be null if unassigned
      },
      deadline: {
        type: DataTypes.DATE, // Optional deadline for the subtask
        allowNull: true,
      },
    },
    {
      tableName: 'SubTask',
      timestamps: true, // Automatically adds createdAt and updatedAt fields
    }
  );

  // Associations
  SubTask.associate = (models) => {
    // Associate SubTask with Task
    SubTask.belongsTo(models.Task, {
      foreignKey: 'taskId',
      as: 'parentTask',
    });
    SubTask.hasMany(models.SubTaskHistory, {
      foreignKey: 'subTaskId', // The foreign key in TaskHistory model
      as: 'history', // Alias to use for the relation
    });
    // Associate SubTask with User (assuming User model exists)
    SubTask.belongsTo(models.User, {
      foreignKey: 'assignedTo',
      as: 'assignee',
    });
    
  };
 

  return SubTask;
};
