import { getIO } from "../../../socket";
import { successResponse } from "../../helpers";
import { Board, sequelize } from "../../models";
import {Task,TaskHistory,SubTask,SubTaskHistory,User} from "../../models";
import { getAllBoards } from "./task.controller";
import { Op } from 'sequelize';

export const createboard = async (req, res) => {
  try {

    const { companyId, name,projectId } = req.body;

    // Check if a board with the same name already exists
    const existingBoard = await Board.findOne({ where: { name, companyId,projectId } });

    if (existingBoard) {
      return res
        .status(400)
        .json({ error: "A board with the same name already exists in this company." });
    }
    const io = getIO();

    const board = await Board.create({ name, companyId,projectId });

    const updatedBoards = await getAllBoards(board.companyId);
    io.emit('boardsUpdated', updatedBoards);
    return res.status(201).json(board);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
};


export const getAllBoardsByCompanyId = async (req, res) => {
  const { companyId } = req.body; // Get companyId from request body

  try {
    // Validate if companyId is provided
    if (!companyId) {
      return res.status(400).json({ error: 'Company ID is required' });
    }

    // Fetch boards associated with the given companyId, including associated tasks and their history
    const boards = await Board.findAll({
      where: { companyId: companyId },
      include: [
        {
          model: Task,
          as: 'tasks',
          include: [
            {
              model: TaskHistory,
              as: 'history',
            },
            {
              model: SubTask,
              as: 'subtasks',
              include: [
                {
                  model: SubTaskHistory,
                  as: 'history',
                },
              ],
            },
          ],
        },
      ],
    });

    // Check if any boards are found
    if (!boards || boards.length === 0) {
      return res.status(404).json({ message: 'No boards found for this company' });
    }

    // Rearrange boards into an object with the board ID as the key
    const boardsWithItems = boards.reduce((acc, board) => {
      const boardData = board.toJSON(); // Convert Sequelize model to plain object

      acc[boardData.id] = {
        name: boardData.name,
        companyId: boardData.companyId,

        projectId:boardData.projectId,

        createdAt: boardData.createdAt,
        updatedAt: boardData.updatedAt,
        items: boardData.tasks.map((task) => ({
          id: String(task.id), // Convert task.id to a string
          title: task.title,
          assignedTo: [task.assignedTo],
          deadline: task.deadline,
          tag: task.tag,
          budget:task.budget,
          description: task.description,
          createdAt: task.createdAt,
          updatedAt: task.updatedAt,
          history: task.history.map((historyItem) => ({
            createdBy: historyItem.createdBy,
            changeHistory: historyItem.changeHistory,
            creationDate: historyItem.creationDate,
            lastModifiedDate: historyItem.lastModifiedDate,
          })),
          subtasks: task.subtasks.map((subtask) => ({
            id: String(subtask.id),
            title: subtask.title,
            assignedTo: [subtask.assignedTo],
            deadline: subtask.deadline,
            status: subtask.status,
            description: subtask.description,
            createdAt: subtask.createdAt,
            updatedAt: subtask.updatedAt,
            history: subtask.history.map((subtaskHistoryItem) => ({
              createdBy: subtaskHistoryItem.createdBy,
              changeHistory: subtaskHistoryItem.changeHistory,
              creationDate: subtaskHistoryItem.creationDate,
              lastModifiedDate: subtaskHistoryItem.lastModifiedDate,
            })),
          })),
        })),
      };

      return acc;
    }, {});

    // Return the boards with the desired structure
    return res.status(200).json({ boards: boardsWithItems });
  } catch (error) {
    console.error("BIG ISSUE ---", error);
    return res.status(500).json({ error: 'An error occurred while fetching boards' });
  }
};




export const deleteBoardAndAssociations = async (req, res) => {
  const boardId = req.body.id;

  const t = await sequelize.transaction();

  try {
    // Delete all TaskHistory related to tasks of the given board
    const tasks = await Task.findAll({
      where: { boardId },
      attributes: ['id'],
      transaction: t,
      raw: true,  // This will return raw data (plain objects), not instances
    });

    // Map over the tasks to get task ids
    const taskIds = tasks.map(task => task.id);

    if (taskIds.length > 0) {
      await TaskHistory.destroy({
        where: {
          taskId: {
            [Op.in]: taskIds,
          },
        },
        transaction: t,
      });
    }

    // Delete all SubTaskHistory related to subtasks of tasks
    const subtasks = await SubTask.findAll({
      where: { taskId: { [Op.in]: taskIds } },
      attributes: ['id'],
      transaction: t,
      raw: true,  // This will return raw data (plain objects), not instances
    });

    // Map over the subtasks to get subtask ids
    const subTaskIds = subtasks.map(subtask => subtask.id);

    if (subTaskIds.length > 0) {
      await SubTaskHistory.destroy({
        where: {
          subTaskId: {
            [Op.in]: subTaskIds,
          },
        },
        transaction: t,
      });
    }

    // Delete all SubTasks associated with tasks of the given board
    await SubTask.destroy({
      where: {
        taskId: {
          [Op.in]: taskIds,
        },
      },
      transaction: t,
    });

    // Delete all Tasks associated with the board
    await Task.destroy({
      where: { boardId },
      transaction: t,
    });

    // Finally, delete the Board
    await Board.destroy({
      where: { id: boardId },
      transaction: t,
    });

    // Commit the transaction
    await t.commit();
    const io = getIO();
    io.emit('boardsUpdated', {});
    return successResponse(req, res, { message: 'Board and its associations deleted successfully.' });

  } catch (error) {
    // Rollback the transaction on error
    await t.rollback();
    console.error('Error during deletion:', error);
    res.status(500).json({ message: 'An error occurred while deleting the board and its associations.' });
  }
};


export const ClearBoardAndAssociations = async (req, res) => {
  const boardId = req.body.id;

  const t = await sequelize.transaction();

  try {
    // Delete all TaskHistory related to tasks of the given board
    const tasks = await Task.findAll({
      where: { boardId },
      attributes: ['id'],
      transaction: t,
    });

    // Map over the tasks to get task ids
    const taskIds = tasks.map(task => task.id);

    if (taskIds.length > 0) {
      await TaskHistory.destroy({
        where: {
          taskId: {
            [Op.in]: taskIds,
          },
        },
        transaction: t,
      });
    }

    // Delete all SubTaskHistory related to subtasks of tasks
    const subtasks = await SubTask.findAll({
      where: { taskId: { [Op.in]: taskIds } },
      attributes: ['id'],
      transaction: t,
    });

    // Map over the subtasks to get subtask ids
    const subTaskIds = subtasks.map(subtask => subtask.id);

    if (subTaskIds.length > 0) {
      await SubTaskHistory.destroy({
        where: {
          subTaskId: {
            [Op.in]: subTaskIds,
          },
        },
        transaction: t,
      });
    }

    // Delete all SubTasks associated with tasks of the given board
    await SubTask.destroy({
      where: {
        taskId: {
          [Op.in]: taskIds,
        },
      },
      transaction: t,
    });

    // Delete all Tasks associated with the board
    await Task.destroy({
      where: { boardId },
      transaction: t,
    });

    // Commit the transaction
    await t.commit();
    const io = getIO();
    io.emit('boardsUpdated', {});  // Notify clients that the board has been updated
    return successResponse(req, res, { message: 'Board and its associations deleted successfully.' });

  } catch (error) {
    // Rollback the transaction on error
    await t.rollback();
    console.error('Error during deletion:', error);
    res.status(500).json({ message: 'An error occurred while deleting the board and its associations.' });
  }
};
