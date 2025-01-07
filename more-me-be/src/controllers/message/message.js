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
