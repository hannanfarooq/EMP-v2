'use strict';
module.exports = (sequelize, DataTypes) => {
  const TaskHistory = sequelize.define(
    'TaskHistory',
    {
        taskId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
              model: 'tasks', // Assuming you have a 'tasks' table
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
            type: DataTypes.JSON, // JSON array to store each modification's details
            allowNull: true,
            defaultValue: [],
          },
        
          creationDate: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
          },
        
          // Last modification date
          lastModifiedDate: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: DataTypes.NOW,
          },
    
    
    },
    {
      tableName: 'TaskHistory',
      timestamps: true, // Automatically adds createdAt and updatedAt fields
    }
  );

  TaskHistory.associate = (models) => {
    // Associate TaskHistory with Task
    TaskHistory.belongsTo(models.Task, {
      foreignKey: 'taskId', // Foreign key to the task model
      as: 'task',
      onDelete: 'CASCADE', // Alias for the relation
    });
    
    // Associate TaskHistory with User (createdBy)
    TaskHistory.belongsTo(models.User, {
      foreignKey: 'createdBy',
      as: 'user', // Alias for the user who made the change
    });
  };

 

  return TaskHistory;
};
