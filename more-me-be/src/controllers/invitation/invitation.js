import { where } from 'sequelize';
import  { Invitation, User, Conversation } from  '../../models';

// Create an invitation
export const createInvitation = async (req, res) => {
  try {
    const { invitedUserId, conversationId } = req.body;

    const invitation = await Invitation.create({
      invitedUserId,
      conversationId
    });

    res.status(201).json(invitation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Respond to an invitation
export const respondToInvitation = async (req, res) => {
  try {
    
    const { id } = req.params;
    const { status } = req.body;

    const invitation = await Invitation.findByPk(id);

    if (!invitation) {
      return res.status(404).json({ error: 'Invitation not found' });
    }

    invitation.status = status;
    await invitation.save();

    

    res.json(invitation);
  } catch (error) {
    // console.log("------------------INVITATION ERROR,",error.message);
    res.status(500).json({ error: error.message });
  }
};

// Get invitations by user ID
export const getInvitationsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    // Step 1: Fetch Invitations where status is 'pending' for the given userId
    let invitations = await Invitation.findAll({
      where: { invitedUserId: userId, status: 'pending' },
      attributes: ['id', 'status', 'conversationId'],
    });

    // Step 2: Fetch Conversations for the fetched invitations
    const conversationIds = invitations.map(invitation => invitation.conversationId);
    const conversations = await Conversation.findAll({
      where: { id: conversationIds },
      attributes: ['id', 'chatName', 'groupAdminId','isGroupChat'],
    });

    // Step 3: Fetch Users (admins) for the fetched conversations
    const adminIds = conversations.map(conversation => conversation.groupAdminId);
    const admins = await User.findAll({
      where: { id: adminIds },
      attributes: ['id', 'firstName', 'lastName', 'profilePic'],
    });

    // Step 4: Combine the data into the desired format
    invitations = invitations.map(invitation => {
      const conversation = conversations.find(conv => conv.id === invitation.conversationId);
      const admin = admins.find(adm => adm.id === conversation.groupAdminId);
      return {
        invitationId: invitation.id,
        status: invitation.status,
        conversationName: conversation.chatName,
        isGroupChat:conversation.isGroupChat,
        chatName:conversation.chatName,
        adminFirstName: admin.firstName,
        adminLastName: admin.lastName,
        adminProfilePicture: admin.profilePic,
      };
    });
// console.log('-------------------',invitations);
    res.json(invitations);
  } catch (error) {
    // console.log('-------------------', error.message);
    res.status(500).json({ error: error.message });
  }
};