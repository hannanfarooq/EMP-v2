import { errorResponse, successResponse } from "../../helpers";
import { Conversation, User, Message, Invitation } from '../../models';
import { Op, where } from 'sequelize';
import { sendEMail } from "../../helpers/mailer";
import user from "../../models/user";
export const getConversationsForUser = async (req, res) => {
  try {
    const { userId } = req.params; 

    
    // Find all conversations where the current user is a member
    const conversations = await Conversation.findAll({
      where: {
        users: {
          [Op.contains]: [userId]
        }
      },
      
    });
    // console.log("---------------CONVO",conversations);
if(conversations)
  {
    return successResponse(req,res,conversations)
  }
  else
  {
    conversations={}
    return successResponse(req,res,conversations)
  }
 
  } catch (error) {
    // console.log(error.message);
    res.status(500).json({ error: error.message });
  }
};

// Create a new conversation
export const createConversation = async (req, res) => {
  try {
    const { chatName, isGroupChat, userIds, groupAdminId } = req.body;

    // If it's a one-to-one chat, check if a conversation already exists
    if (!isGroupChat) {
      const existingConversation = await Conversation.findOne({
        where: {
          isGroupChat: false,
          [Op.or]: [
            {
              groupAdminId: groupAdminId,
              users: {
                [Op.contains]: userIds, // Check if userIds are in the users array
              }
            },
            {
              groupAdminId: userIds[0], // Reverse the check, i.e., check if the user is the admin
              users: {
                [Op.contains]: [groupAdminId], // Check if groupAdminId is in the users array
              }
            }
          ]
        }
      });

      if (existingConversation) {
        return res.status(400).json({ status:400, message: "Conversation already exists." });
      }
    }

    // Create the conversation
    const conversation = await Conversation.create({
      chatName,
      isGroupChat,
      users: userIds,
      groupAdminId
    });
    // console.log("---------------------------------------------", userIds);

    // Prepare the invitation message
    const admin = await User.findByPk(groupAdminId); // Assuming you have a User model
    const messageText = isGroupChat 
      ? `${admin.firstName + " " + admin.lastName} invited you to join the group chat: ${chatName}`
      : `${admin.firstName + " " + admin.lastName} invited you to a one-to-one chat`;

    // Send the invitation message and create an invitation record for each user
    for (const userId of userIds) {
      try {
        // console.log(`Creating message for user ${userId}`);
        
        // const mess = await Message.create({
        //   senderId: groupAdminId,
        //   content: "",
        //   chatId: conversation.id,
        //   readBy: [],
        // });
        // await conversation.update({
        //   latestMessageId: mess.id,
        // });
        // console.log(`Message created: ${mess.id}`);
        const user = await User.findByPk(userId);
        let sender_email = `ahmadawais00786@gmail.com`;
        let receiver_email = user.email; 
        let email_subject = "Invitation to Join Chat!";
        let email_body = messageText;
        const inv = await Invitation.create({
          invitedUserId: userId,
          conversationId: conversation.id,
          status: 'pending'
        });
        sendEMail(sender_email, receiver_email, email_subject, email_body);

        // console.log(`Invitation created: ${inv.id}`);
      } catch (error) {
        console.error(`Error processing user ${userId}:`, error.message);
      }
    }
    return successResponse(req, res, { conversation });

  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};




export const getConversationById = async (req, res) => {
  try {
    const { id } = req.params;

    // Fetch conversations where the user is the group admin
    const adminConversations = await Conversation.findAll({
      where: {
        groupAdminId: id
      }
    });

    // Fetch all invitations for the user
    const invitations = await Invitation.findAll({
      where: {
        invitedUserId: id
      },
      attributes: ['conversationId', 'status']
    });

    // Filter accepted conversation IDs
    const acceptedConversationIds = invitations
      .filter(invitation => invitation.status === 'accepted')
      .map(invitation => invitation.conversationId);

    // Fetch conversations where the user is a participant and the invitation is accepted
    const participantConversations = await Conversation.findAll({
      where: {
        id: {
          [Op.in]: acceptedConversationIds
        },
        users: {
          [Op.contains]: [id]
        }
      }
    });

    // Combine admin and participant conversations
    let conversations = [...adminConversations, ...participantConversations];

    if (conversations.length === 0) {
      return res.status(404).json({ conversations: [] });
    }

    // Extract unique sender IDs from all conversations
    let senderIds = conversations.flatMap(conversation => conversation.users);
    senderIds.push(conversations.map(conversation => conversation.groupAdminId));
    senderIds = [...new Set(senderIds.flat())];

    // Fetch users based on sender IDs
    const users = await User.findAll({
      where: {
        id: {
          [Op.in]: senderIds
        }
      },
      attributes: ['id', 'firstName', 'lastName', 'profilePic', 'email']
    });

    // Create a map of user IDs to user names and profile pics
    const userMap = users.reduce((map, user) => {
      map[user.id] = {
        fullName: `${user.firstName} ${user.lastName}`,
        profilePic: user.profilePic,
        email: user.email
      };
      return map;
    }, {});

    // Fetch latest message and format conversations
    conversations = await Promise.all(conversations.map(async (conversation) => {
      try {
        let latestMessageContent = null;
        let latestMessageSender = null;
        let message;

        // Check if there is a latest message and fetch its content
        if (conversation.latestMessageId) {
          message = await Message.findOne({
            where: { id: conversation.latestMessageId }
          });

          if (message) {
            latestMessageContent = message.content;
            latestMessageSender = userMap[message.senderId]?.fullName || 'Unknown';
          }
        }

        // If no message is found, set default values
        if (!latestMessageContent) {
          latestMessageContent = null; // Default message when no messages exist
          latestMessageSender = null;
        }

        // Determine chatName based on whether it's a group chat or direct chat
        let chatName;
        if (conversation.isGroupChat) {
          chatName = conversation.chatName;
        } else {
          const otherUserId = conversation.users.find(userId => userId !== parseInt(id));
          chatName = userMap[otherUserId]?.fullName || '';
        }

        // Filter userMap to include only users relevant to the current conversation
        const filteredUserMap = conversation.users.reduce((map, userId) => {
          if (userMap[userId]) {
            map[userId] = userMap[userId];
          }
          return map;
        }, {});

        // Include group admin in the filtered userMap
        if (userMap[conversation.groupAdminId]) {
          filteredUserMap[conversation.groupAdminId] = userMap[conversation.groupAdminId];
        }

        return {
          id: conversation.id,
          chatName,
          isGroupChat: conversation.isGroupChat,
          users: conversation.users,
          groupAdminId: conversation.groupAdminId,
          userMap: filteredUserMap,
          latestMessage: latestMessageContent,
          latestMessageSender: latestMessageSender,
          readBy: message?.readBy || [], // Handle readBy field properly
          updatedAt: conversation.updatedAt,  // Include updatedAt for sorting
          avatar: userMap[latestMessageSender]?.profilePic || 'https://example.com/default-avatar.jpg',
        };
      } catch (error) {
        console.error('Error fetching message:', error.message);
        throw error;
      }
    }));

    // Sort conversations by updatedAt in descending order
    conversations.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

    // console.log('Conversations:', conversations);

    return res.json({ conversations });
  } catch (error) {
    console.error('Error in getConversationById:', error.message);
    return res.status(500).json({ error: error.message });
  }
};


export const addUserToConversation = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body; // userId is expected to be an array containing all user IDs to be added

    if (!userId || !Array.isArray(userId)) {
      return res.status(400).json({ error: 'Invalid userIds data' });
    }

    let conversation = await Conversation.findByPk(id);

    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    // Initialize an array to hold the created invitations
    const invitations = [];

    for (let index = 0; index < userId.length; index++) {
      
      let ini = await Invitation.findOne({
        where:{
          invitedUserId: userId[index],
          conversationId: conversation.id
        }
      })
      if(ini)
        {
          ini.status="pending";
          ini.changed('status', true);
        await  ini.save();
        }
        else
        {
          ini = await Invitation.create({
            invitedUserId: userId[index],
            conversationId: conversation.id
          });
        }
      
      
      invitations.push(ini);

      // Update conversation with new user ID if not already present
      if (!conversation.users.includes(userId[index])) {
        conversation.users.push(userId[index]);
      }
    }

    // Mark users as changed
    conversation.changed('users', true);
    
    await conversation.save();

    return successResponse(req, res, { conversation, invitations });
  } catch (error) {
    console.error("------------------Error adding users to conversation:", error);
    res.status(500).json({ error: error.message });
  }
};


// Remove a user from a conversation
export const removeUserFromConversation = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
// console.log('------------------ OBJECT',userId);
    const conversation = await Conversation.findByPk(id);

    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    conversation.users = userId;
    await conversation.save();

	return successResponse(req,res,{conversation});
  } catch (error) {
    // console.log("----------------------------",error.message)
    res.status(500).json({ error: error.message });
  }
};
