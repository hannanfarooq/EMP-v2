import { errorResponse, successResponse } from "../../helpers";
import db from "../../models"; // Import from the central models file

const { StartUpQuestions } = db;

console.log("StartUpQuestions Model:", StartUpQuestions); // Log the model

export const createStartUpQuestions = async (req, res) => {
  const {
    userId,
    companyId,
    authorName,
    bookTitle,
    engagementMethod,
    hobbies,
    interestTopics,
    lifePrincipleInspirations,
    personalityType,
    readingPreference,
    relaxationActivities,
    contentPreferences
  } = req.body;

  console.log("Received data:", req.body);

  if (!userId || !companyId) {
    return errorResponse(req, res, "userId and companyId are required.");
  }

  try {
    const dataToCreate = {
      userId,
      companyId,
      authorName,
      bookTitle,
      contentPreferences: contentPreferences ? contentPreferences.join(',') : null,
      engagementMethod,
      hobbies: hobbies ? hobbies.join(',') : null,
      interestTopics: interestTopics ? interestTopics.join(',') : null,
      lifePrincipleInspirations: lifePrincipleInspirations ? lifePrincipleInspirations.join(',') : null,
      personalityType,
      readingPreference,
      relaxationActivities: relaxationActivities ? relaxationActivities.join(',') : null,
    };

    console.log("Data being passed to create method:", dataToCreate);

    const startUpQuestion = await StartUpQuestions.create(dataToCreate);
    return successResponse(req, res, startUpQuestion);
  } catch (error) {
    console.error("Error creating start-up question:", error);
    return errorResponse(req, res, "Error creating start-up question.");
  }
};



export const getAllStartUpQuestionsByCompanyIdAndUserId = async (req, res) => {
  try {
    const { companyId, userId } = req.body;
    const users = await StartUpQuestions.findAll({ where: { companyId, userId } });
    return successResponse(req, res, users);
  } catch (error) {
    return errorResponse(req, res, error);
    throw error;
  }
};