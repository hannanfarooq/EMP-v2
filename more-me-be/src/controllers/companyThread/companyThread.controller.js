import { getIO } from "../../../socket";
import { errorResponse, successResponse } from "../../helpers";
import { User, Company, CompanyThread, ThreadMessage } from "../../models"; // Assuming you have your Sequelize instance initialized
import { Op } from 'sequelize';





export const createCompanyThread = async (req, res) => {
  try {
    console.log(req.body);
    const companyThread = await CompanyThread.create(req.body);
    console.log("CREATED");
const {userId,companyId}= req.body
    const io = getIO();
 
    io.emit("fetchthreads",true);
    
  
  io.emit('getcount',true);
    return successResponse(req, res, companyThread);
  } catch (error) {
    console.log(error);
    return errorResponse(req, res, error);
  }
};

// Update a CompanyThread by ID
export const updateCompanyThread = async (req, res) => {
  const { id } = req.params;
  try {
    const [updated] = await CompanyThread.update(req.body, {
      where: { id },
    });
    if (updated) {
      const updatedCompanyThread = await CompanyThread.findByPk(id);
      return successResponse(req, res, updatedCompanyThread);
    }
    return errorResponse(req, res, "NO thread found against this id ");
  } catch (error) {
    return errorResponse(req, res, error);
  }
};

export const getAllCompanyThreads = async (req, res) => {
  try {
    const { companyId } = req.params;

    // Fetch all company threads
    let companyThreads = await CompanyThread.findAll({
      where: {
        companyId: companyId,
      },
      order: [['createdAt', 'DESC']],
    });

    // Collect all unique user IDs from likes and dislikes
    const uniqueUserIds = new Set();

    companyThreads.forEach((thread) => {
      const threadLikes = thread.likes || [];
      const threadDislikes = thread.dislikes || [];

      // Add userIds to the unique set
      threadLikes.forEach((userId) => uniqueUserIds.add(userId));
      threadDislikes.forEach((userId) => uniqueUserIds.add(userId));
    });

    // Fetch user details for all the unique userIds in one query
    const users = await User.findAll({
      where: {
        id: Array.from(uniqueUserIds),
      },
      attributes: ['id', 'firstName', 'lastName'], // Fetch only required fields
    });

    // Create a map of userId to full name
    const userMap = users.reduce((map, user) => {
      map[user.id] = `${user.firstName} ${user.lastName}`;
      return map;
    }, {});
    const results = [];
    // Map the likes and dislikes to user names for each thread
    companyThreads = companyThreads.map((companyThread) => {
      const threadLikes = companyThread.likes || [];
      const threadDislikes = companyThread.dislikes || [];

      // Map userIds to full names
      const mappedLikes = threadLikes.map((userId) => userMap[userId] || userId); // Default to userId if not found
      const mappedDislikes = threadDislikes.map((userId) => userMap[userId] || userId);
      companyThread.likes =mappedLikes;
      companyThread.dislikes = mappedDislikes;
      // Update the companyThread object with mapped likes and dislikes
      const resultObject = {
        companyThread,
      };
      results.push(resultObject);
    });

    // Return the updated companyThreads array with likes and dislikes mapped to user names
    return res.status(200).json(results);
  } catch (error) {
    console.log('error', error);
    return res.status(500).json({ error: 'An error occurred while fetching threads' });
  }
};


export const  toggleLike = async (req, res) => {
  const threadId = req.params.id;
  const userId = req.body.id; // Assuming user ID is available from session or token

  try {
      const thread = await CompanyThread.findByPk(threadId);
      if (!thread) {
          return res.status(404).send({ message: "Thread not found." });
      }

      // Toggle like
      const likes = new Set(thread.likes); // Convert array to Set for easier management
      if (likes.has(userId)) {
          likes.delete(userId);
      } else {
          likes.add(userId);
          // Remove from dislikes if exists
          const dislikes = new Set(thread.dislikes);
          if (dislikes.delete(userId)) {
              thread.dislikes = Array.from(dislikes);
          }
      }
      thread.likes = Array.from(likes);
      await thread.save();
      const io = getIO();
 
      io.emit("fetchthreads",true);

      res.send({ likes: thread.likes, dislikes: thread.dislikes });
  } catch (error) {
      res.status(500).send({ message: "Error updating likes", error });
  }
};

export const toggleDislike = async (req, res) => {
  const threadId = req.params.id;
  const userId = req.body.id; // Assuming user ID is available from session or token

  try {
      const thread = await CompanyThread.findByPk(threadId);
      if (!thread) {
          return res.status(404).send({ message: "Thread not found." });
      }

      // Toggle dislike
      const dislikes = new Set(thread.dislikes);
      if (dislikes.has(userId)) {
          dislikes.delete(userId);
      } else {
          dislikes.add(userId);
          // Remove from likes if exists
          const likes = new Set(thread.likes);
          if (likes.delete(userId)) {
              thread.likes = Array.from(likes);
          }
      }
      thread.dislikes = Array.from(dislikes);
      await thread.save();
      const io = getIO();
 
      io.emit("fetchthreads",true);

      res.send({ likes: thread.likes, dislikes: thread.dislikes });
  } catch (error) {
      res.status(500).send({ message: "Error updating dislikes", error });
  }
};



export const updateView = async (req, res) => {
  try {
    const { userId, companyId } = req.body; // Get the userId and companyId from the request body

    // Log query start
    console.log("COMPANY THREAD Query RUNNING");

    // Fetch threads that don't already have the userId in the 'viewedBy' array
    const companyThreads = await CompanyThread.findAll({
      where: {
        companyId: companyId,
      },
    });

    // Log query end
    console.log("COMPANY THREAD Query Completed");

    // If no threads need to be updated, early return
    if (companyThreads.length === 0) {
      return res.status(200).json({ message: "No threads to update for this user" });
    }

    // Prepare the update for the 'viewedBy' field
    const updates = [];

    // Collect threads that need an update (where userId is not already in 'viewedBy')
    companyThreads.forEach((thread) => {
      let updatedViewedBy = Array.isArray(thread.viewedBy)
        ? thread.viewedBy // Already an array
        : []; // Fallback to empty array if not

      // Check if the userId is not already in the 'viewedBy' array
      if (!updatedViewedBy.includes(userId)) {
        updatedViewedBy.push(userId); // Add the userId to the 'viewedBy' array
        updates.push({
          id: thread.id,  // The thread's ID
          viewedBy: updatedViewedBy, // Updated 'viewedBy' array
        });
      }
    });

    // If no updates are needed, return early
    if (updates.length === 0) {
      return res.status(200).json({ message: "No new threads to update for this user" });
    }
let count=0;
    // Perform bulk updates for only those threads where updates are needed
    await Promise.all(
      updates.map(async (update) => {
        ++count;
        await CompanyThread.update(
          { viewedBy: update.viewedBy }, // Update the 'viewedBy' array
          {
            where: {
              id: update.id, // Ensure we're updating the correct thread
            },
          }
        );
      })
    );
    console.log("TOTAL QUERY ",count);

    // Emit the event once after all updates are done
    const io = getIO();
    io.emit('getcount', true);

    console.log("User view updated for all threads in the company");
    return res.status(200).json({ message: "User view updated for all threads in the company" });
  } catch (error) {
    console.error("Error updating view:", error);
    return res.status(500).json({ error: "An error occurred while updating views" });
  }
};


export const getUnviewedThreadsCount = async (req, res) => {
  try {
    const { userId, companyId } = req.body; // Get the userId and companyId from the request body
  

    // Retrieve all threads for the specified companyId
    const companyThreads = await CompanyThread.findAll({
      where: {
        companyId: companyId, // Filter by companyId
      },
    });

    // Manually count the threads where the user has not viewed them
    const unviewedThreadsCount = companyThreads.filter(thread => {
      // Check if the userId is NOT in the viewedBy array
      return !thread.viewedBy.includes(userId);
    }).length;

    return res.status(200).json({ unviewedThreadsCount });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "An error occurred while counting unviewed threads" });
  }
};
