'use strict';
module.exports = (sequelize, DataTypes) => {
  const Conversation = sequelize.define('Conversation', {
    chatName: { type: DataTypes.STRING, trim: true },
    isGroupChat: { type: DataTypes.BOOLEAN, default: false },
    users: {
      type: DataTypes.ARRAY(DataTypes.INTEGER),
      allowNull: false,
    },
    latestMessageId: {
      type: DataTypes.INTEGER,
      
    },
    groupAdminId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'User',
        key: 'id',
      },
    },
  }, {});

  return Conversation;
};