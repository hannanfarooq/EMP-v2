import { successResponse } from "../../helpers";
import { Game } from "../../models";

// Create Game
export const createGame = async (req, res) => {
  try {
    const { name, subCategoryId } = req.body;

    // Check required fields
    if (!name || !subCategoryId) {
      return res.status(400).json({ error: "Name and subCategoryId are required." });
    }

    // Create a new game
    const game = await Game.create({ name, subCategoryId });

    // Return success response
    return successResponse(req, res, game);

  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
};

// Get Games by SubCategory
export const getGamesBySubCategory = async (req, res) => {
  try {
    const { subCategoryId } = req.body;
    const whereCondition = {};

    // If subCategoryId is provided, filter games by subCategoryId
    if (subCategoryId) whereCondition.subCategoryId = subCategoryId;

    // Fetch games based on the condition
    const games = await Game.findAll({
      where: whereCondition,
    });

    // Return success response
    return successResponse(req, res, games);

  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
};

// Update Game
export const updateGame = async (req, res) => {
  try {
    const { id, name } = req.body;

    // Find the game by primary key
    const game = await Game.findByPk(id);

    if (!game) {
      return res.status(404).json({ error: "Game not found." });
    }

    // Update the game with new details
    await game.update({ name });

    // Return success response
    return successResponse(req, res, game);

  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
};

// Delete Game
export const deleteGame = async (req, res) => {
  try {
    const { id } = req.body;

    // Find the game by primary key
    const game = await Game.findByPk(id);

    if (!game) {
      return res.status(404).json({ error: "Game not found." });
    }

    // Delete the game
    await game.destroy();

    // Return success response
    return successResponse(req, res, {});

  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
};
