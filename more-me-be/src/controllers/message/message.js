import { Message, User, Conversation } from '../../models';
import { Op, where } from 'sequelize';
// Create a new message
export const createMessage = async (req, res) => {
  try {
    const { senderId, content, chatId } = req.body;
// console.log("------------------------Posting a Message",req.body);
    const message = await Message.create({
      senderId,
      content,
      chatId,
      readBy:[],
    });
   
    
    await Conversation.update({ latestMessageId: message.id }, { where: { id: chatId } });
    
    res.status(201).json(message);
  } catch (error) {
    // console.log("------------------------Posting a Message",error.message);
    res.status(500).json({ error: error.message });
  }
};

// Get messages by conversation ID
export const getMessagesByConversationId = async (req, res) => {
  try {
    const { chatId } = req.params;

    // Fetch messages based on chatId
    let messages = await Message.findAll({
      where: { chatId }
    });

    // Extract unique sender IDs from messages
    const senderIds = [...new Set(messages.map(message => message.senderId))];

    // Fetch all users with these sender IDs in a single query
    const users = await User.findAll({
      where: {
        id: {
          [Op.in]: senderIds
        }
      },
      attributes: ['id', 'firstName', 'lastName'] // Fetch only necessary attributes
    });

    // Create a map of user IDs to user names
    const userMap = users.reduce((map, user) => {
      map[user.id] = `${user.firstName} ${user.lastName}`;
      return map;
    }, {});

    // Combine message data with sender names
     messages = messages.map(message => {
      return {
        ...message.get(), 
        senderName: userMap[message.senderId] || 'Unknown'
      };
    });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Mark message as read
export const markMessageAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const { chatid } = req.body;

    const conversation = await Conversation.findOne({
      where:
      {
        id:chatid
      }
    })

    const message = await Message.findOne({
      where:{
        id:conversation.latestMessageId
      }
    });

    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    if (!message.readBy.includes(id)) {
      message.readBy.push(id);
      message.changed('readBy', true);
      await message.save();
    }

    res.json(message);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export const updateMessageStatus = async (req, res) => {
  try {
    const { chatId,userid } = req.body; // Get chatId from request parameters

    if (!chatId) {
      return res.status(400).json({ message: 'Chat ID is required' });
    }

    // Update messages where status is 'sent' to 'delivered'
    const updatedSentMessages = await Message.update(
      { status: 'delivered' },
      {
        where: {
          chatId: chatId,
          senderId: { [Op.ne]: userid }, // Sender is not the current user
          status: 'sent',
        },
      }
    );

    // Then, update messages with status 'delivered' to 'seen'
    const updatedDeliveredMessages = await Message.update(
      { status: 'seen' },
      {
        where: {
          chatId: chatId,
          senderId: { [Op.ne]: userid }, // Sender is not the current user
          status: 'delivered',
        },
      }
    );

    if (updatedSentMessages[0] === 0 && updatedDeliveredMessages[0] === 0) {
      return res.status(404).json({ message: 'No messages found to update' });
    }

    return res.status(200).json({ message: 'Messages updated successfully', updatedMessages });
  } catch (error) {
    console.error('Error updating messages:', error);
    return res.status(500).json({ message: 'Internal server error', error });
  }
};