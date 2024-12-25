// threadMessageController.js

import { errorResponse, successResponse } from "../../helpers";
import {
  User,
  Company,
  CompanyThread,
  threadMessage as ThreadMessage,
} from "../../models";
// Create a new ThreadMessage
export const createThreadMessage = async (req, res) => {
  const { companyThreadId, userId, heading, message } = req.body;
  try {
    const threadMessage = await ThreadMessage.create({
      companyThreadId,
      userId,
      heading,
      message,
    });
    return successResponse(req, res, threadMessage);
  } catch (error) {
    return errorResponse(req, res, error);
  }
};

// Get all ThreadMessages for a specific CompanyThread
export const getAllThreadMessages = async (req, res) => {
  const { companyThreadId } = req.params;
  try {
    const threadMessages = await ThreadMessage.findAll({
      where: { companyThreadId },
    });

    return successResponse(req, res, threadMessages);
  } catch (error) {
    return errorResponse(req, res, error);
  }
};

// Update a ThreadMessage by ID
export const updateThreadMessage = async (req, res) => {
  const { id } = req.params;
  try {
    const [updated] = await ThreadMessage.update(req.body, {
      where: { id },
    });
    if (updated) {
      const updatedThreadMessage = await ThreadMessage.findByPk(id);
      return successResponse(req, res, updated);
    }
    return errorResponse(req, res, "cant update");
  } catch (error) {
    return errorResponse(req, res, error);
  }
};

// Delete a ThreadMessage by ID
export const deleteThreadMessage = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await ThreadMessage.destroy({
      where: { id },
    });
    if (deleted) {
      return successResponse(req, res, deleted);
    }
    return errorResponse(req, res, "Error in deleting message");
  } catch (error) {
    return errorResponse(req, res, error);
  }
};
