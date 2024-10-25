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
      type: DataTypes.STRING,
      allowNull: false,
      trim: true,
    },
    chatId: {
      type: DataTypes.INTEGER,
      allowNull: false,
     
    },
    readBy: {
      type: DataTypes.ARRAY(DataTypes.INTEGER), 
      allowNull: true,
    },
   
  }, {
    timestamps: true,
  });

  return Message;
};