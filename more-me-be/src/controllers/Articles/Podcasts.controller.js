

import  { Podcasts } from "../../models"; // Import the Webinars model
import { Op } from "sequelize";

// ✅ 1️⃣ Create a new Webinars
export const createPodcast = async (req, res) => {
  try {
    const { title, urls } = req.body;

    // Validate input
    if (!title || !urls || !Array.isArray(urls)) {
      return res.status(400).json({ error: "Title and a valid URLs array are required" });
    }

    // Check if the Webinars already exists
    let podcast = await Podcasts.findOne({ where: { title } });

    if (podcast) {
      // Replace old URLs with new ones
      await podcast.update({ urls: JSON.stringify(urls) });

      return res.status(200).json({ message: "Podcast updated", podcast });
    } else {
      // Create a new Webinars
      podcast = await Podcasts.create({ title, urls: JSON.stringify(urls) });

      return res.status(201).json({ message: "Podcast created", podcast });
    }
  } catch (error) {
    console.error("Error creating/updating Webinars:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

  
export const getpodcastUrlsByTitle = async (req, res) => {
  try {
    const { titles } = req.body;

    

    // Use Op.in to filter multiple titles
    const podcasts = await Podcasts.findAll({
      where: { title: { [Op.in]: titles.titles } },
      attributes: ["title", "urls", "updatedAt"], // Include updatedAt
    });

    // Convert results into a mapping { title: { urls, updatedAt } }
    const result = podcasts.reduce((acc, podcast) => {
      acc[podcast.title] = {
        urls: podcast.urls,
        updatedAt: podcast.updatedAt, // Include updatedAt in response
      };
      return acc;
    }, {});

 
    return res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching URLs by titles:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
