import  { Videos } from "../../models"; // Import the Videos model
import { Op } from "sequelize";

// ✅ 1️⃣ Create a new Videos
export const createVideos = async (req, res) => {
  try {
    const { title, urls } = req.body;

    // Validate input
    if (!title || !urls || !Array.isArray(urls)) {
      return res.status(400).json({ error: "Title and a valid URLs array are required" });
    }

    // Check if the Videos already exists
    let Video = await Videos.findOne({ where: { title } });

    if (Video) {
      // Replace old URLs with new ones
      await Video.update({ urls: JSON.stringify(urls) });

      return res.status(200).json({ message: "Videos updated", Video });
    } else {
      // Create a new Videos
      Video = await Videos.create({ title, urls: JSON.stringify(urls) });

      return res.status(201).json({ message: "Videos created", Videos });
    }
  } catch (error) {
    console.error("Error creating/updating Videos:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

  
export const getVideoUrlsByTitle = async (req, res) => {
  try {
    const { titles } = req.body;

    

    // Use Op.in to filter multiple titles
    const Videoss = await Videos.findAll({
      where: { title: { [Op.in]: titles.titles } },
      attributes: ["title", "urls", "updatedAt"], // Include updatedAt
    });

    // Convert results into a mapping { title: { urls, updatedAt } }
    const result = Videoss.reduce((acc, Videos) => {
      acc[Videos.title] = {
        urls: Videos.urls,
        updatedAt: Videos.updatedAt, // Include updatedAt in response
      };
      return acc;
    }, {});

 
    return res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching URLs by titles:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
