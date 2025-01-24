import { SubTask, Task, User,TaskHistory,SubTaskHistory,Notification } from '../../models'; 
import { getIO } from "../../../socket";
import { getAllBoards } from './task.controller';

export const Create_SubTask = async (req, res) => {
    try {
      const { title, description,  taskId, assignedTo, deadline } = req.body;
      const userId = req.user.id; // User ID from authentication
  
      // Step 1: Validate the parent task
      const parentTask = await Task.findOne({ where: { id: taskId } });
      if (!parentTask) {
        return res.status(404).json({ error: 'Parent task not found' });
      }
  
      // Step 2: Validate assigned user (if provided)
      let assigneeName = null;
      let assignee;
      if (assignedTo) {
         assignee = await User.findOne({ where: { id: assignedTo } });
        if (!assignee) {
          return res.status(404).json({ error: 'Assigned user not found' });
        }
        assigneeName = `${assignee.firstName} ${assignee.lastName}`;
      }
  
      // Step 3: Create the SubTask
      const subTask = await SubTask.create({
        title,
        description,
        status: 'Pending', // Default status is "Pending"
        taskId,
        assignedTo,
        deadline,
      });
  
      // Step 4: Log the creation in SubTask history
      await SubTaskHistory.create({
        subTaskId: subTask.id,
        createdBy: userId, // User creating the subtask
        changeHistory: [
          {
            field: 'status',
            action: 'created',
            previousValue: null,
            newValue: 'Pending',
            description: `${req.user.firstName} ${req.user.lastName} created the subtask under "${parentTask.title} for  ${assigneeName}"`,
          },
         
        ],
        creationDate: subTask.createdAt,
        lastModifiedDate: subTask.createdAt,
      });
      const io = getIO(); // Ensure `getIO` is called after `Socket_Maker`.
   const updatedBoards = await getAllBoards(assignee.companyId);
      io.emit('boardsUpdated', updatedBoards);
      // Step 5: Notify clients about the updated tasks
      await Notification.create({
        title:"NEW TASK ASSIGNED",
        message: `${req.user.firstName} ${req.user.lastName} created the subtask under "${parentTask.title} for  ${assigneeName}"`,
        userId:assignedTo,
        type:"Task",
        
      });

      const notifications = await Notification.findAll({
        where: { userId:assignedTo },
        order: [['createdAt', 'DESC']], // Sort by newest notifications first
      });
      io.emit('EmitNotification', notifications,);
  
      // Step 6: Return response
      return res.status(201).json({
        message: 'SubTask created successfully',
        data: subTask,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error.message });
    }
  };


 export const updateSubTaskStatus = async (req, res) => {
    try {
    
      const {subTaskId, status, updatedBy } = req.body; // Get the new status and the ID of the user making the change
  
      // Validate the input
      if (!status || !['Pending', 'In Progress', 'Completed'].includes(status)) {
        return res.status(400).json({ error: 'Invalid status provided.' });
      }
  
      if (!updatedBy) {
        return res.status(400).json({ error: 'User updating the status is required.' });
      }
  
      // Fetch the subtask and the user who updated the status
      const subTask = await SubTask.findByPk(subTaskId);
      if (!subTask) {
        return res.status(404).json({ error: 'Subtask not found.' });
      }
  
      const user = await User.findByPk(updatedBy);
      if (!user) {
        return res.status(404).json({ error: 'User not found.' });
      }
  
      // Log the current status before updating
      const previousStatus = subTask.status;
  
      // Update the subtask status
      subTask.status = status;
      await subTask.save();
      // Log the history
     
      await SubTaskHistory.create({
        subTaskId: subTask.id,
        createdBy: user.id, // User creating the subtask
        changeHistory: [
          {
            field: 'status',
            action: 'created',
            previousValue: null,
            newValue: 'Pending',
            description: `Status changed from "${previousStatus}" to "${status}" by ${user.firstName} ${user.lastName}`,

          },
         
        ],
        creationDate: subTask.updatedAt,
        lastModifiedDate: subTask.updatedAt,
      });

      const io = getIO(); // Ensure `getIO` is called after `Socket_Maker`.
      const updatedBoards = await getAllBoards(user.companyId);
         io.emit('boardsUpdated', updatedBoards);
      // Respond with the updated subtask
      return res.status(200).json({
        message: 'Subtask status updated successfully.',
        subTask,
      });
    } catch (error) {
      console.error('Error updating subtask status:', error);
      return res.status(500).json({ error: 'An error occurred while updating the subtask status.' });
    }
  };