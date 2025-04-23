import  { Books } from "../../models"; // Import the Books model
import { Op } from "sequelize";

// ✅ 1️⃣ Create a new Books
export const createBooks = async (req, res) => {
  try {
    const { title, urls } = req.body;

    // Validate input
    if (!title || !urls || !Array.isArray(urls)) {
      return res.status(400).json({ error: "Title and a valid URLs array are required" });
    }

    // Check if the Books already exists
    let book = await Books.findOne({ where: { title } });

    if (book) {
      // Replace old URLs with new ones
      await book.update({ urls: JSON.stringify(urls) });

      return res.status(200).json({ message: "Books updated", book });
    } else {
      // Create a new Books
      book = await Books.create({ title, urls: JSON.stringify(urls) });

      return res.status(201).json({ message: "Books created", book });
    }
  } catch (error) {
    console.error("Error creating/updating Books:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

  
export const getBooksUrlsByTitle = async (req, res) => {
  try {
    const { titles } = req.body;

    // Use Op.in to filter multiple titles
    const Bookss = await Books.findAll({
      where: { title: { [Op.in]: titles.titles } },
      attributes: ["title", "urls", "updatedAt"], // Include updatedAt
    });

    // Convert results into a mapping { title: { urls, updatedAt } }
    const result = Bookss.reduce((acc, Books) => {
      acc[Books.title] = {
        urls: Books.urls,
        updatedAt: Books.updatedAt, // Include updatedAt in response
      };
      return acc;
    }, {});

    
    return res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching URLs by titles:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
