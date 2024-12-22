import { attribute } from "@sequelize/core/_non-semver-use-at-your-own-risk_/expression-builders/attribute.js";
import { errorResponse, successResponse } from "../../helpers";
import { QuestionCategory, Gamification, User } from "../../models";
import gamifications from "../../models/gamifications";
import { where } from "sequelize";

export const createGamifications = async (req, res) => {
  const data = req.body;
  console.log("data of game", data);

  try {
    const gamificationData = await data.map((question) =>
      Gamification.create({
        type: question.type,
        text: question.text,
        options: question.options,
        companyId: question.companyId,
        image: question.image,
        media: question.media,
        questionCategoryId: question.questionCategoryId,
        correctOption: question.correctOption,
        columnA: question.columnA,
        columnB: question.columnB,
        columnMatching: question.columnMatch,
      })
    );

    return await Promise.all(gamificationData).then((data) =>
      successResponse(req, res, data)
    );
  } catch (error) {
    console.error("Error creating Gamifications:", error);
    throw error;
  }
};

export const getCompanyGamifications = async (req, res) => {
  try {
    const { companyId } = req.body;
    const gamifications = await Gamification.findAll({ where: { companyId } });

    const categories = await QuestionCategory.findAll({ where: { companyId } });

    return successResponse(req, res, { gamifications, categories });
  } catch (error) {
    throw error;
  }
};
export const GetUserGamification = async (req, res) => {
  try {

    const { id } = req.params;
    const user = await User.findByPk(id, {
      attributes: ['gamification', 'points']
    });
    if (!user) {
      throw new Error("User not found");
    }




    return successResponse(req, res, user);
  } catch (error) {
    return errorResponse(req, res, error);
    throw error;
  }
};
export const GetUserGamificationbyCompany = async (req, res) => {
  try {

    console.log("PARAMS : ", req.params);
    const { companyId } = req.params;
    const user = await User.findAll({
      where: {
        companyId: companyId
      }
    }, {
      attributes: ['firstName', 'lastName', 'email', 'points', 'profilePic']
    });
    if (!user) {
      throw new Error("User not found");
    }

    return successResponse(req, res, user);
  } catch (error) {
    return errorResponse(req, res, error);
    throw error;
  }
};

export const updateUserGamification = async (req, res) => {
  try {
    // Destructure required fields from the request body
    const { gamification, id, points } = req.body;

    console.log("------------------------------GAMIFICATIONS1", req.body);

    // Find the user by their ID
    const user = await User.findByPk(id);

    // Check if the user exists
    if (!user) {
      return errorResponse(req, res, new Error("User not found"));
    }



    // Update the user's gamification and points
    if (gamification && points) {
      // Ensure user.gamification is an array and check for the existence of the gamification

      const gamificationExists = Object.values(user.gamification).some(existingGamification => {
        // Compare by unique identifier, such as 'id' or another property
        existingGamification.id == gamification;
      });

      if (!gamificationExists) {

        user.gamification[gamification] = true;

      }

      user.points = points;
      console.log("UPDATED USER", user);
    }

    user.changed('gamification', true);
    user.changed('points', true);

    // Save the changes to the database
    const resp = await user.save();
    return successResponse(req, res, resp);
  } catch (error) {
    return errorResponse(req, res, error);
  }
};