'use strict';
module.exports = (sequelize, DataTypes) => {
  const Task = sequelize.define(
    'Task',
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      assignedTo: {
        type: DataTypes.INTEGER, // Foreign key to store user ID
        allowNull: false,
      },
      deadline: {
        type: DataTypes.DATE,
        allowNull: true, // Can be null if no deadline is set
      },
      tag: {
        type: DataTypes.STRING, // Example: "High Priority", "Medium Priority", etc.
        allowNull: false,
      },
      
      description: {
        type: DataTypes.TEXT, // To store longer text
        allowNull: true, // Description can be optional
      },
      boardId: {
        type: DataTypes.INTEGER, // Foreign key from Board table
        allowNull: false,
        references: {
          model: 'Board', // Name of the referenced table
          key: 'id', // Column in the Board table
        },
      },
    },
    {
      tableName: 'Task',
      timestamps: true, // Automatically adds createdAt and updatedAt fields
    }
  );

  // Associations
  Task.associate = (models) => {
    // Associate Task with Board
    Task.belongsTo(models.Board, {
      foreignKey: 'boardId',
      as: 'board',
    });

    // Associate Task with User (assuming User model exists)
    Task.belongsTo(models.User, {
      foreignKey: 'assignedTo',
      as: 'assignee',
    });
    Task.hasMany(models.TaskHistory, {
      foreignKey: 'taskId', // The foreign key in TaskHistory model
      as: 'history', // Alias to use for the relation
    });
    Task.hasMany(models.SubTask, {
      foreignKey: 'taskId', // The foreign key in TaskHistory model
      as: 'subtasks', // Alias to use for the relation
    });
    
  };
  

  return Task;
};
