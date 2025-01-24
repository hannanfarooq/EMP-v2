'use strict';
module.exports = (sequelize, DataTypes) => {
  const TaskChat = sequelize.define(
    'TaskChat',
    {
      taskId: {
        type: DataTypes.INTEGER, // Foreign key linking to Task table
        allowNull: false,
        references: {
          model: 'Task', // Name of the referenced table
          key: 'id', // Column in the Task table
        },
      },
      userId: {
        type: DataTypes.INTEGER, // Foreign key linking to User table
        allowNull: false,
        references: {
          model: 'User', // Name of the referenced table
          key: 'id', // Column in the User table
        },
      },
      message: {
        type: DataTypes.TEXT, // To store text messages
        allowNull: true, // Optional if only attachments or images are shared
      },
      imageUrl: {
        type: DataTypes.TEXT, // URL of an uploaded image
        allowNull: true, // Optional
      },
      attachmentUrl: {
        type: DataTypes.TEXT, // URL of an uploaded file/document
        allowNull: true, // Optional
      },
      link: {
        type: DataTypes.TEXT, // URL of a shared link
        allowNull: true, // Optional
      },
    },
    {
      tableName: 'TaskChat',
      timestamps: true, // Automatically adds createdAt and updatedAt fields
    }
  );

  // Associations
  TaskChat.associate = (models) => {
    // Associate TaskChat with Task
    TaskChat.belongsTo(models.Task, {
      foreignKey: 'taskId',
      as: 'task',
    });

    // Associate TaskChat with User
    TaskChat.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'sender',
    });
  };

  return TaskChat;
};
