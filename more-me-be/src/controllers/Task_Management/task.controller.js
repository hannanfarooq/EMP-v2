
const { getIO } = require('../../../socket');
import {Task,User,Board,TaskHistory,SubTask,SubTaskHistory,Notification} from "../../models";
import { getAllBoardsByCompanyId } from "./Board.controller";

export const Create_Task = async (req, res) => {
  try {
    const { title, assignedTo, deadline, tag, description, boardId } = req.body;
    const userId = req.user.id; // Assuming user ID is available from the session or auth token

    // Step 1: Validate if assignedTo is provided and is a valid user ID
    if (!assignedTo) {
      return res.status(400).json({ error: 'Assigned user is required' });
    }

    // Step 2: Create the task
    const task = await Task.create({
      title,
      assignedTo,
      deadline,
      tag,
      description,
      boardId,
     
    });

    // Step 3: Query users involved (creator and assignee) to get their names
    const creator = await User.findOne({ where: { id: userId } });
    const assignee = await User.findOne({ where: { id: assignedTo } });

    if (!assignee) {
      return res.status(404).json({ error: 'Assignee not found' });
    }

    // Step 4: Query the board to get the board name
    const board = await Board.findOne({ where: { id: boardId } });

    if (!board) {
      return res.status(404).json({ error: 'Board not found' });
    }

    // Get the names of the creator, the assignee, and the board name
    const creatorName = `${creator.firstName} ${creator.lastName}`;
    const assigneeName = `${assignee.firstName} ${assignee.lastName}`;
    const boardName = board.name; // Assuming `name` is the column holding the board name

    // Step 5: Create a new record in TaskHistory table with detailed change history
    await TaskHistory.create({
      taskId: task.id,
      createdBy: userId, // User who created the task
      changeHistory: [
        {
          field: 'assignedTo',
          action: 'assigned',
          previousValue: null, // Task wasn't assigned before
          newValue: assigneeName, // Assign the task to this user
          description: `${creatorName} assigned the task to ${assigneeName} on board ${boardName}`,
        }
       
      ],
      creationDate: task.createdAt,
      lastModifiedDate: task.createdAt,
    });
    const io = getIO();
    const updatedBoards = await getAllBoards(board.companyId);
    io.emit('boardsUpdated', updatedBoards);
     await Notification.create({
      title:"NEW TASK ASSIGNED",
      message: `${creatorName} assigned the task to You on board ${boardName}`,
      userId:assignedTo,
      type:"Task",
      
    });
    const notifications = await Notification.findAll({
      where: { userId:assignedTo },
      order: [['createdAt', 'DESC']], // Sort by newest notifications first
    });
    io.emit('EmitNotification', notifications,);

    // Step 6: Return the response
    return res.status(201).json({
      message: 'Task created and assigned successfully',
      data: task,
    });
  } catch (error) {
    console.log("BIG ERROR _ ",error);
    return res.status(500).json({ error: error.message });
  }
};

export const getAllBoards = async (companyId) => {
  try {
    // Fetch boards associated with the given companyId, including tasks, subtasks, and their histories
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

    // Check if boards are found
    if (!boards || boards.length === 0) {
      throw new Error('No boards found for this company');
    }

    // Rearrange boards into an object with the board ID as the key
    const boardsWithItems = boards.reduce((acc, board) => {
      const boardData = board.toJSON(); // Convert Sequelize model to plain object

      acc[boardData.id] = {
        name: boardData.name,
        companyId: boardData.companyId,
        createdAt: boardData.createdAt,
        updatedAt: boardData.updatedAt,
        items: boardData.tasks.map((task) => ({
          id: String(task.id), // Convert task.id to a string
          title: task.title,
          assignedTo: [task.assignedTo],
          deadline: task.deadline,
          tag: task.tag,
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

    return boardsWithItems;
  } catch (error) {
    console.error("Error fetching boards:", error);
    throw error;
  }
};


const  someTaskManagementFunction = async (companyId) => {
  try {
      const io = getIO(); // Ensure `getIO` is called after `Socket_Maker`.
      const updatedBoards = await getAllBoards(companyId);
   console.log("EMITING BOARD : ",updatedBoards);
      io.emit('boardsUpdated', updatedBoards);  // Broadcast updated boards to all clients
   console.log("EMITED BOARD : ",updatedBoards);






  } catch (error) {
      console.error('Error accessing Socket.IO:', error.message);
  }
}
export const updateTaskBoardId = async (req, res) => {
  const { taskId, newBoardId, userId } = req.body; // Extract taskId, newBoardId, and userId from the request body

  try {
    // Validate input
    if (!taskId || !newBoardId || !userId) {
      return res.status(400).json({ error: 'Task ID, new Board ID, and User ID are required' });
    }

    // Find the task by ID
    const task = await Task.findOne({ where: { id: taskId } });

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Fetch the user by userId to get the username
    const user = await User.findOne({ where: { id: userId } });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Fetch previous and new board names
    const previousBoardId=task.boardId
    const previousBoard = await Board.findOne({ where: { id: task.boardId } });
    const newBoard = await Board.findOne({ where: { id: newBoardId } });

    if (!previousBoard || !newBoard) {
      return res.status(404).json({ error: 'One or both of the boards not found' });
    }

    // Save the current boardId for history reference
    const previousBoardName = previousBoard.name;
    const newBoardName = newBoard.name;

    // Update the boardId of the task
    task.boardId = newBoardId;
    await task.save();

    // Record the change in TaskHistory
    const taskHistory = await TaskHistory.create({
      taskId: task.id,
      createdBy: userId, // User who made the change
      changeHistory: [
        {
          field: 'boardId',
          action: 'updated',
          previousValue: previousBoardId,
          newValue: newBoardId,
          description: `${user.firstName +" "+ user.lastName} moved the task from Phase "${previousBoardName}" to Phase "${newBoardName}"`,
        },
      ],
    });
    someTaskManagementFunction(user.companyId);

    // Return the updated task and history
    return res.status(200).json({
      message: 'Task updated successfully',
      task,
      taskHistory,
    });
  } catch (error) {
    console.error('Error updating task boardId:', error);
    return res.status(500).json({ error: 'An error occurred while updating the task' });
  }
};
export const updateTaskUser = async (req, res) => {
  const { taskId, newAssignee, userId } = req.body; // Extract taskId, newBoardId, and userId from the request body

  try {
    // Validate input
    if (!taskId || !newAssignee || !userId) {
      return res.status(400).json({ error: 'Task ID, new Board ID, and User ID are required' });
    }

    // Find the task by ID
    const task = await Task.findOne({ where: { id: taskId } });

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Fetch the user by userId to get the username
    const user = await User.findOne({ where: { id: userId } });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Fetch previous and new board names
    const previousBoardId=task.assignedTo
    if(previousBoardId==newAssignee)
    {
      return res.status(400).json({ error: 'Assined to Same Person Again' });
      
    }
    const previousBoard = await User.findOne({ where: { id: previousBoardId } });
    const newBoard = await User.findOne({ where: { id: newAssignee } });

    if (!previousBoard || !newBoard) {
      return res.status(404).json({ error: 'One or both of the boards not found' });
    }

    // Save the current boardId for history reference
    const previousBoardName = previousBoard.firstName+" "+previousBoard.lastName ;
    const newBoardName = newBoard.firstName+" "+newBoard.lastName;

    // Update the boardId of the task
    task.assignedTo = newAssignee;
    await task.save();

    // Record the change in TaskHistory
    const taskHistory = await TaskHistory.create({
      taskId: task.id,
      createdBy: userId, // User who made the change
      changeHistory: [
        {
          field: 'boardId',
          action: 'updated',
          previousValue: previousBoardId,
          newValue: newAssignee,
          description: `${user.firstName +" "+ user.lastName} Re-Assined  the task from  "${previousBoardName}" to  "${newBoardName}"`,
        },
      ],
    });
    someTaskManagementFunction(user.companyId);
    const io = getIO(); 
      await Notification.create({
      title:"NEW TASK ASSIGNED",
      message:  `${user.firstName +" "+ user.lastName} Re-Assined  the task : "${task.title}" from  "${previousBoardName}" to  You`,
      userId:newAssignee,
      type:"Task",
      
    });
    const notifications = await Notification.findAll({
      where: { userId:newAssignee },
      order: [['createdAt', 'DESC']], // Sort by newest notifications first
    });
    io.emit('EmitNotification', notifications,);

    // Return the updated task and history
    return res.status(200).json({
      message: 'Task updated successfully',
      task,
      taskHistory,
    });
  } catch (error) {
    console.error('Error updating task boardId:', error);
    return res.status(500).json({ error: 'An error occurred while updating the task' });
  }
};

export const updateDailyFeedback = async (req, res) => {
  const { todayDate, dailyFeedback, userId } = req.body; // Extract taskId, newBoardId, and userId from the request body
  console.log("daily feedback", dailyFeedback);

  try {
    // Validate input
    if (!todayDate || !dailyFeedback || !userId) {
      return res.status(400).json({ error: 'Daily feedback, today date and User ID are required' });
    }

    // Fetch the user by userId to get the username
    const user = await User.findOne({ where: { id: userId } });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update the user's daily feedback and today's date
    await user.update({
      dailyFeedback: dailyFeedback,
      todayDate: todayDate
    });

    // Return the updated task and history
    return res.status(200).json({
      message: 'Daily feedback updated successfully',
      todayDate,
      dailyFeedback,
    });
  } catch (error) {
    console.error('Error updating feedback:', error);
    return res.status(500).json({ error: 'An error occurred while updating the feedback', details: error.message });
  }
};
