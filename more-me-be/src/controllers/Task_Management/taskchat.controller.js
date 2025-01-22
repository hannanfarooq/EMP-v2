import { getIO } from "../../../socket";
import {TaskChat,User} from "../../models";

  export const    CreateTaskChat= async(req, res) =>{
      try {
        const { taskId, userId, message, imageUrl, attachmentUrl, link } = req.body;
  
        // Validate required fields
        if (!taskId || !userId) {
          return res.status(400).json({ error: 'Task ID and User ID are required.' });
        }
  
        // Create the chat message
        const newChat = await TaskChat.create({
          taskId,
          userId,
          message,
          imageUrl,
          attachmentUrl,
          link,
        });

        const io = getIO(); // Ensure `getIO` is called after `Socket_Maker`.
       
   
        io.emit('getchat', true);  // Broadcast updated boards to all clients
     
  
        return res.status(201).json(newChat);
      } catch (error) {
        console.error('Error creating TaskChat:', error);
        return res.status(500).json({ error: 'Failed to create chat message.' });
      }
    }


    export const  gettaskchat = async (req, res)=> {
        try {
          const { taskId } = req.body;
    
          if (!taskId) {
            return res.status(400).json({ error: 'Task ID is required.' });
          }
    
          const chats = await TaskChat.findAll({
            where: { taskId },
            include: [
              {
                model: User,
                as: 'sender',
                attributes: ['id', 'firstName', 'lastName','profilePic'], // Customize fields returned for User
              },
            ],
            order: [['createdAt', 'ASC']],
          });
    
          return res.status(200).json(chats);
        } catch (error) {
          console.error('Error fetching chats:', error);
          return res.status(500).json({ error: 'Failed to fetch chats.' });
        }
      }