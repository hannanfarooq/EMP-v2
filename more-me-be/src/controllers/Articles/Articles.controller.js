import  { Article } from "../../models"; // Import the Article model
import { Op } from "sequelize";

// ✅ 1️⃣ Create a new article
export const createArticle = async (req, res) => {
  try {
    const { title, urls } = req.body;

    // Validate input
    if (!title || !urls || !Array.isArray(urls)) {
      return res.status(400).json({ error: "Title and a valid URLs array are required" });
    }

    // Check if the article already exists
    let article = await Article.findOne({ where: { title } });

    if (article) {
      // Replace old URLs with new ones
      await article.update({ urls: JSON.stringify(urls) });

      return res.status(200).json({ message: "Article updated", article });
    } else {
      // Create a new article
      article = await Article.create({ title, urls: JSON.stringify(urls) });

      return res.status(201).json({ message: "Article created", article });
    }
  } catch (error) {
    console.error("Error creating/updating article:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

  
export const getUrlsByTitle = async (req, res) => {
  try {
    const { titles } = req.body;


    // Use Op.in to filter multiple titles
    const articles = await Article.findAll({
      where: { title: { [Op.in]: titles.titles } },
      attributes: ["title", "urls", "updatedAt"], // Include updatedAt
    });

    // Convert results into a mapping { title: { urls, updatedAt } }
    const result = articles.reduce((acc, article) => {
      acc[article.title] = {
        urls: article.urls,
        updatedAt: article.updatedAt, // Include updatedAt in response
      };
      return acc;
    }, {});

   
    return res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching URLs by titles:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
