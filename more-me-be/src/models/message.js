'use strict';
module.exports = (sequelize, DataTypes) => {
  const Message = sequelize.define('Message', {
    senderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'User', 
        key: 'id',
      },
    },
    
    content: {
      type: DataTypes.TEXT,  // Change this to TEXT to allow large content
      allowNull: false,
      trim: true, // Ensure content is trimmed, though TEXT fields will handle larger content
    },
    chatId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    readBy: {
      type: DataTypes.ARRAY(DataTypes.INTEGER), 
      allowNull: true,
    },
    status: { 
      type: DataTypes.ENUM('sent', 'delivered','seen'), // Add status field
      allowNull: false,
      defaultValue: 'sent' // Default status is 'sent' (✓)
    },
  
    
  }, {
    timestamps: true,
  });

  return Message;
};
