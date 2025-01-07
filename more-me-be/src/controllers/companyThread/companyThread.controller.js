import { errorResponse, successResponse } from "../../helpers";
import { User, Company, CompanyThread, ThreadMessage } from "../../models"; // Assuming you have your Sequelize instance initialized
import { Op } from 'sequelize';
export const createCompanyThread = async (req, res) => {
  try {
    // console.log(req.body);
    const companyThread = await CompanyThread.create(req.body);
    return successResponse(req, res, companyThread);
  } catch (error) {
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

    // Fetch all company threads along with associated user information (firstName, lastName)
    let companyThreads = await CompanyThread.findAll({
      include: 
         User,
        
   
      where: {
        companyId: companyId,
      },
      order: [
        ['createdAt', 'DESC'],
      ],
    });

    const results = [];

    // Iterate through the retrieved CompanyThread records
    for (const companyThread of companyThreads) {
      const threadLikes = companyThread.likes || [];
      const threadDislikes = companyThread.dislikes || [];

      // Function to map user IDs to their full names (firstName + lastName)
      const mapUserIdsToNames = async (userIds) => {
        const userNames = {};

        // Query the User model to find users by their IDs
        const users = await User.findAll({
          where: {
            id: userIds,
          },
          attributes: ['id', 'firstName', 'lastName'], // Select only the required fields
        });

        // Map the user data to a userNames object where key is userId and value is full name
        users.forEach(user => {
          userNames[user.id] = `${user.firstName} ${user.lastName}`;
        });

        return userNames; // Return the map of user IDs to names
      };

      // Map the likes and dislikes user IDs to their names
      const mappedLikes = await mapUserIdsToNames(threadLikes);
      const mappedDislikes = await mapUserIdsToNames(threadDislikes);

      // Update the companyThread object with the mapped likes and dislikes
      companyThread.likes = mappedLikes;
      companyThread.dislikes = mappedDislikes;

      // Create the result object with the updated likes and dislikes
      const resultObject = {
        companyThread,
      };

      // Add the resultObject to the results array
      results.push(resultObject);
    }

    // Return the updated results array with likes and dislikes mapped to user names
    return res.status(200).json(results);
  } catch (error) {
    console.log('error', error);
    return res.status(500).json({ error });
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

      res.send({ likes: thread.likes, dislikes: thread.dislikes });
  } catch (error) {
      res.status(500).send({ message: "Error updating dislikes", error });
  }
};

// Controller to update the viewedBy field in all threads for the current user
export const updateView = async (req, res) => {
  try {
    const { userId, companyId } = req.body; // Get the userId and companyId from the request body
    // console.log("User view update request", req.body);

    // Find all company threads by companyId
    const companyThreads = await CompanyThread.findAll({
      where: {
        companyId: companyId,
      },
    });

    for (let thread of companyThreads) {
      // If the user has not viewed the thread, add them to the viewedBy array
      if (!thread.viewedBy.includes(userId)) {
        // Explicitly set the updated array to ensure Sequelize saves it properly
        thread.viewedBy = [...thread.viewedBy, userId];  // Spread the array and add the userId
        await thread.save(); // Save the updated thread
      }
    }

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
    // console.log("getUnviewedThreadsCount", req.body);

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

    // console.log("getUnviewedThreadsCount", unviewedThreadsCount);

    return res.status(200).json({ unviewedThreadsCount });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "An error occurred while counting unviewed threads" });
  }
};
