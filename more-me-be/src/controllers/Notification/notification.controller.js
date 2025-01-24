
import { getIO } from "../../../socket";
import {Notification} from "../../models";


export const getNotificationsByUserId =async (req, res) => {
    try {
      const { userId } = req.body;

      // Validate userId is provided
      if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
      }

      // Fetch notifications for the user
      const notifications = await Notification.findAll({
        where: { userId },
        order: [['createdAt', 'DESC']], // Sort by newest notifications first
      });

      // Return notifications
      return res.status(200).json({
        message: 'Notifications retrieved successfully',
        notifications,
      });
    } catch (error) {
      console.error('Error fetching notifications:', error);
      return res.status(500).json({ error: 'An error occurred while fetching notifications' });
    }
  }

  export const markAllNotificationsAsRead = async (req, res) => {
    const { userId } = req.body; // Assuming userId is passed as a URL parameter
  
    try {
      // Find all notifications for the given user where isRead is false
      const notifications = await Notification.update(
        { isRead: true }, // Update the isRead field to true
        {
          where: { 
            userId: userId,  // Filter by userId
            isRead: false,    // Optionally only update unread notifications
          }
        }
      );
  
     const io=getIO();

     const notification = await Notification.findAll({
      where: { userId:userId },
      order: [['createdAt', 'DESC']], // Sort by newest notifications first
    });
    io.emit('EmitNotification', notification);
  
      return res.status(200).json({ message: 'All notifications marked as read successfully.' });
      
    } catch (error) {
      console.error('Error marking notifications as read:', error);
      return res.status(500).json({ message: 'An error occurred while marking notifications as read.' });
    }
  };