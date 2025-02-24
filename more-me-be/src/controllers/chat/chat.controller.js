import { errorResponse, successResponse } from "../../helpers";
import { Conversation, Message, User } from "../../models";
const { Op } = require('sequelize');

export const createConversation = async (req, res) => {
	try {
		let { user1Id, user2Id } = req.body;

		if (!user1Id || !user2Id) {
			return errorResponse(req, res, { error: 'Missing fields '});
		}

		const conversation = await Conversation.findOne({
			where: {
				[Op.or]: [
					{
						user1Id,
						user2Id,
					},
					{
						user1Id: user2Id,
						user2Id: user1Id,
					},
				],
			},
		});

		if (!conversation) {
			const newConversation = await Conversation.create({
				user1Id,
				user2Id,
			});

			return successResponse(req, res, newConversation)
		} else {
			return successResponse(req, res, conversation)
		}
	} catch (error) {
		console.error(error);
		return errorResponse(req, res, error);
	}
};

export const postMessage = async (req, res) => {
	try {
		let { user1Id, user2Id, senderId, messageText } = req.body;

		if (!user1Id || !user2Id || !senderId || !messageText) {
			return errorResponse(req, res, { error: 'Missing fields '});
		}

		const conversation = await Conversation.findOne({
			where: {
				[Op.or]: [
					{
						user1Id,
						user2Id,
					},
					{
						user1Id: user2Id,
						user2Id: user1Id,
					},
				],
			},
		});

		if (!conversation) {
			const newConversation = await Conversation.create({
				user1Id,
				user2Id,
			});

			const newMessage = await Message.create({
				conversationId: newConversation.id,
				senderId: senderId, // Assuming user1 is the sender
				messageText,
			});

			return successResponse(req, res, { message: newMessage })
		} else {
			const newMessage = await Message.create({
				conversationId: conversation.id,
				senderId: senderId, // Assuming user1 is the sender
				messageText,
			});

			return successResponse(req, res, { message: newMessage })
		}
	} catch (error) {
		console.error(error);
		return errorResponse(req, res, error);
	}
};

export const getConversations = async (req, res) => {
  try {
    const userId = req?.params?.userId;

		if (!userId) {
			return errorResponse(req, res, { error: 'Missing fields '});
		}

    const conversation = await Conversation.findAll({
      where: {
        [Op.or]: [
          { user1Id: userId },
          { user2Id: userId },
        ],
      },
      include: [
        {
          model: User,
          as: 'User1',
					attributes: { exclude: ['questionnaire', 'readPolicies'] }
        },
        {
          model: User,
          as: 'User2',
					attributes: { exclude: ['questionnaire', 'readPolicies'] }
        },
      ],
    });

		return successResponse(req, res, conversation)
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error retrieving conversations' });
  }
};

export const getMessagesByConversationId = async (req, res) => {
  try {
		const conversationId = parseInt(req?.query?.conversationId);

		if (!conversationId || !Number.isInteger(conversationId)) {
			return errorResponse(req, res, { error: 'Missing fields '});
		}
    const messages = await Message.findAll({
      where: {
        conversationId: conversationId,
      },
    });

		return successResponse(req, res, messages)
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}