import { Sequelize } from "sequelize";
import { errorResponse, successResponse } from "../../helpers";
import { Question, QuestionCategory, Questionnaire, DynamicQuestionnaire, UserAttemptedQuestionnaire, DailyQuestionWithOptions } from "../../models"; // Assuming you have your Sequelize instance initialized

export const createQuestions = async (req, res) => {
  const data = req.body;

  try {
    const questionData = await data.map((question) =>
      Question.create({
        type: question.type,
        text: question.text,
        options: question.options,
        companyId: question.companyId,
        image: question.image,
        questionCategoryId: question.questionCategoryId,
      })
    );

    return await Promise.all(questionData).then((data) =>
      successResponse(req, res, data)
    );
  } catch (error) {
    console.error("Error creating Questions:", error);
    throw error;
  }
};

//createUserAttemptQuestionnaire
export const createUserAttemptQuestionnaire = async (req, res) => {
  const data = req.body;
  //console.log("createUserAttemptQuestionnaire data", data);
  try {
    // Assuming that data is a single object, not an array
    const questionData = await UserAttemptedQuestionnaire.create({
      companyId: data.companyId,
      userId: data.userId,
      questionnaireId: data.questionnaireId,
      questionnaire: data.questionnareData,
    });

    return successResponse(req, res, questionData);
  } catch (error) {
    console.error("Error creating Questions:", error);
    return errorResponse(req, res, "Error creating Questions");
  }
};


//createDynamicQuestion
export const createDynamicQuestion = async (req, res) => {
  const data = req.body;
  //console.log("createDynamicQuestion", data);

  try {
    const questionData = await data.map((question) =>
      DynamicQuestionnaire.create({
        type: question.type,
        text: question.text,
        options: question.options,
        companyId: question.companyId,
        image: question.image,
        questionnaireId: question.questionnaireId,
      })
    );

    return await Promise.all(questionData).then((data) =>
      successResponse(req, res, data)
    );
  } catch (error) {
    console.error("Error creating Questions:", error);
    throw error;
  }
};


export const getCompanyQuestions = async (req, res) => {
  try {
    const { companyId } = req.body;
    const questions = await Question.findAll({ where: { companyId } });

    const categories = await QuestionCategory.findAll({ where: { companyId } });

    return successResponse(req, res, { questions, categories });
  } catch (error) {
    throw error;
  }
};

//getDynamicQuestions
export const getDynamicQuestions = async (req, res) => {
  try {
    const { questionnaireId } = req.params; // Assuming questionnaireId is passed as a URL parameter
    const { companyId } = req.query; // Assuming companyId is passed as a query parameter

    const questions = await DynamicQuestionnaire.findAll({
      where: {
        questionnaireId,
        companyId,
      },
    });

    return successResponse(req, res, { questions });
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};
//getUserAttemptedQuestionnaireToAdmin
// export const getUserAttemptedQuestionnaireToAdmin = async (req, res) => {
//   const { questionnaireId } = req.body; // Assuming questionnaireId is passed as a URL parameter
//   const { companyId } = req.body; // Assuming companyId is passed as a query parameter
//   console.log("getUserAttemptedQuestionnaireToAdmin be controller", questionnaireId, companyId);
//   try {
//     const questions = await UserAttemptedQuestionnaire.findAll({
//       where: {
//         questionnaireId,
//         companyId,
//       },
//     });

//     return successResponse(req, res, { questions });
//   } catch (error) {
//     console.log("error in getUserAttemptedQuestionnaireToAdmin");
//     return errorResponse(req, res, error.message);
//   }
// };
export const getUserAttemptedQuestionnaireToAdmin = async (req, res) => {
  // Extracting the parameters from req.query, as it is a GET request
  const { questionnaireId, companyId } = req.query; 
  // console.log("getUserAttemptedQuestionnaireToAdmin be controller", questionnaireId, companyId);

  try {
    const questions = await UserAttemptedQuestionnaire.findAll({
      where: {
        questionnaireId,
        companyId,
      },
    });

    return successResponse(req, res, { questions });
  } catch (error) {
    // console.log("error in getUserAttemptedQuestionnaireToAdmin");
    return errorResponse(req, res, error.message);
  }
};

//getUserDynamicQuestions
export const getUserDynamicQuestions = async (req, res) => {
  try {
    const { questionnaireId } = req.params; // Assuming questionnaireId is passed as a URL parameter
    const { companyId } = req.query; // Assuming companyId is passed as a query parameter

    const questions = await DynamicQuestionnaire.findAll({
      where: {
        questionnaireId,
        companyId,
      },
    });

    return successResponse(req, res, { questions });
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};

//getUserByCompany
export const getUserByCompany = async (req, res) => {
  try {
    const { companyId } = req.body; // Assuming companyId is passed as a query parameter

    const data = await User.findAll({
      where: {
        companyId,
      },
    });

    return successResponse(req, res, { data });
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};

//getUserAttemptedQuestionnaire
export const getUserAttemptedQuestionnaire = async (req, res) => {
  try {
    const { companyId } = req.params; // Assuming questionnaireId is passed as a URL parameter

    const questions = await UserAttemptedQuestionnaire.findAll({
      where: {
        companyId,
      },
    });

    return successResponse(req, res, { questions });
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};

export const updateCompanyPolicy = async (req, res) => {
  try {
    const policy = await CompanyPolicy.findByPk(req.body.id);
    if (!policy) {
      return errorResponse(req, res, !policy);
      throw new Error("CompanyPolicynot found");
    }
    await CompanyPolicy.update(req.body, {
      where: {
        id: req.body.id, // Replace with the actual ID of the policy you want to update
      },
    });
    return successResponse(req, res, policy);
  } catch (error) {
    console.error("Error updating company:", error);
    throw error;
  }
};

export const deleteCompanyQuestion = async (req, res) => {
  try {
    const { questionId } = req.body;

    const deletedQuestion = await Question.destroy({
      where: { id: questionId },
    });

    return successResponse(req, res, deletedQuestion);
  } catch (error) {
    console.error("Error deleting company question:", error);
    throw error;
  }
};

//deleteDynamicQuestion
export const deleteDynamicQuestion = async (req, res) => {
  try {
    const { questionId } = req.body; // Destructure questionId from the request body
    const { companyId } = req.body; // Destructure questionId from the request body
    // console.log("questionId", questionId);

    // Find the dynamic questionnaire by primary key (ID)
    const dynamicQuestion = await DynamicQuestionnaire.findOne({
      where: {
        id: questionId,
        companyId: companyId // Ensure companyId matches
      }
    });

    if (!dynamicQuestion) {
      // If the dynamic questionnaire is not found, return an error response
      return errorResponse(req, res, "DynamicQuestionnaire not found");
    }

    // Destroy the dynamic questionnaire
    await DynamicQuestionnaire.destroy({
      where: { id: questionId, companyId: companyId  },
    });

    // Return a success response
    return successResponse(req, res, { message: "DynamicQuestionnaire deleted successfully" });
  } catch (error) {
    // Log and handle errors
    console.error("Error deleting dynamic questionnaire:", error);
    return errorResponse(req, res, "Failed to delete dynamic questionnaire");
  }
};

export const addQuestionCategory = async (req, res) => {
  try {
    const { name, companyId, description, video, images,subCategoryId,gameid,starting,canProceedToNextLevel } = req.body;

    // Ensure name is a string
   console.log("ADDED DATA , ",req.body)
    const existingCategory = await QuestionCategory.findOne({
      where: {
        name: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('name')), name.toLowerCase()),
        companyId,
        subCategoryId,
        gameid
      },
    });

    if (existingCategory) {
      return errorResponse(req, res, "Category with the same name already exists for this company.");
    }

    const newCategory = await QuestionCategory.create({
      name,
      companyId,
      images: images || [], // Ensure images is an array
      description: description || "",
      video: video || "",
      subCategoryId:subCategoryId,
      gameid:gameid,
      starting:starting,
      canProceedToNextLevel:canProceedToNextLevel
    });

    return successResponse(req, res, newCategory);
  } catch (error) {
    console.error("Error adding question category:", error);
    return errorResponse(req, res, "An error occurred while adding the category.");
  }
};


// create questionnaire controller
export const createQuestionnaire = async (req, res) => {
  const { questionnaireTitle, questionnaireDescription, isReady, companyId } = req.body;
  //console.log("createQuestionnaire controller be:", req.body);
  try {
    const existingCategory = await Questionnaire.findOne({
      where: {
        questionnaireTitle: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('questionnaireTitle')), questionnaireTitle.toLowerCase()),
        companyId,
      },
    });

    if (existingCategory) {
      return errorResponse(req, res, "Category with the same name already exists for this company.");
    }

    const newCategory = await Questionnaire.create({
      questionnaireTitle,
      companyId,
      questionnaireDescription,
      isReady,
    });

    return successResponse(req, res, newCategory);
  } catch (error) {
    console.error("Error adding question category:", error);
    throw error;
  }
};


export const getQuestionCategories = async (req, res) => {
  const { companyId } = req.params;

  try {
    const categories = await QuestionCategory.findAll({
      where: {
        companyId: companyId,
      },
    });

    return successResponse(req, res, categories);
  } catch (error) {
    console.error("Error fetching question categories:", error);
    throw error;
  }
};

//get questionnaire from db
export const getQuestionnaire = async (req, res) => {
  const { companyId } = req.params;

  try {
    const questionnaire = await Questionnaire.findAll({
      where: {
        companyId: companyId,
      },
    });
    //console.log("Questionnaire", questionnaire);
    return successResponse(req, res, questionnaire);
  } catch (error) {
    console.error("Error fetching question categories:", error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

//getUserQuestionnaire
export const getUserQuestionnaire = async (req, res) => {
  const { companyId } = req.params;

  try {
    const questionnaire = await Questionnaire.findAll({
      where: {
        companyId: companyId,
      },
    });
    //console.log("Questionnaire", questionnaire);
    return successResponse(req, res, questionnaire);
  } catch (error) {
    console.error("Error fetching question categories:", error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteQuestionCategory = async (req, res) => {
  const { categoryId } = req.params;

  try {
    const category = await QuestionCategory.findByPk(categoryId);

    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    await category.destroy();

    return res.status(204).send();
  } catch (error) {
    console.error("Error deleting question category:", error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateCategoryName = async (req, res) => {
  const { categoryId } = req.body;
  const { newName } = req.body;

  try {
    const category = await QuestionCategory.findByPk(categoryId);

    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    category.name = newName;
    await category.save();

    return res.status(200).json({ message: 'Category name updated successfully' });
  } catch (error) {
    console.error("Error updating category name:", error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

//updateQuestionnaireIsReady
export const updateQuestionnaireIsReady = async (req, res) => {
  const { questionnaireId } = req.body;
  const { isReady } = req.body;

  try {
    const questionnaire = await Questionnaire.findByPk(questionnaireId);

    if (!questionnaire) {
      return res.status(404).json({ error: 'Questionnaire not found' });
    }

    questionnaire.isReady = isReady;
    await questionnaire.save();

    return res.status(200).json({ message: 'Questionnaire isReady updated successfully' });
  } catch (error) {
    console.error("Error updating Questionnaire isReady:", error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
//updateQuestionnaireIsLive
export const updateQuestionnaireIsLive = async (req, res) => {
  const { questionnaireId } = req.body;
  const { isLive } = req.body;

  try {
    const questionnaire = await Questionnaire.findByPk(questionnaireId);

    if (!questionnaire) {
      return res.status(404).json({ error: 'Questionnaire not found' });
    }

    questionnaire.isLive = isLive;
    await questionnaire.save();

    return res.status(200).json({ message: 'Questionnaire isReady updated successfully' });
  } catch (error) {
    console.error("Error updating Questionnaire isReady:", error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

//handleUpdateQuestionnaireTitleAndDescription
export const handleUpdateQuestionnaireTitleAndDescription = async (req, res) => {
  const { questionnaireId, questionnaireTitle, questionnaireDescription } = req.body;

  try {
    const questionnaire = await Questionnaire.findByPk(questionnaireId);

    if (!questionnaire) {
      return res.status(404).json({ error: 'Questionnaire not found' });
    }

    questionnaire.questionnaireTitle = questionnaireTitle;
    questionnaire.questionnaireDescription = questionnaireDescription;
    await questionnaire.save();

    return res.status(200).json({ message: 'Questionnaire title and description updated successfully' });
  } catch (error) {
    console.error("Error updating Questionnaire title and description:", error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Controller to create a daily questionnaire
// export const createDailyQuestionnaire = async (req, res) => {
//   const questions = req.body;  // Expecting an array of questions
//   console.log("Received data:", questions);

//   // Validate input data
//   if (!Array.isArray(questions) || questions.length === 0) {
//     return errorResponse(req, res, "No questions provided.");
//   }

//   try {
//     for (const { questionText, options, type, companyId } of questions) {
//       console.log('Processing question:', { questionText, options, type, companyId });

//       // Validate each question
//       if (!questionText || !type || !companyId) {
//         return errorResponse(req, res, "Text, type, and companyId are required.");
//       }

//       if (type !== "textfield" && (!options || options.length === 0)) {
//         return errorResponse(req, res, "Options are required for types other than 'textfield'.");
//       }

//       // Check if a similar question already exists (optional)
//       const existingQuestion = await DailyQuestionWithOptions.findOne({ 
//         where: {
//           questionText: Sequelize.where(Sequelize.fn("LOWER", Sequelize.col("questionText")), questionText.toLowerCase()),
//           companyId,
//         },
//       });

//       if (existingQuestion) {
//         return errorResponse(req, res, "A similar question already exists for this company.");
//       }

//       // Create the daily question
//       const newQuestion = await DailyQuestionWithOptions.create({
//         questionText,
//         type,
//         companyId,
//       });

//       // Add options if applicable
//       if (type !== "textfield" && options && options.length > 0) {
//         const optionsData = options.map((option) => ({
//           questionText: option,
//           questionId: newQuestion.id,
//         }));

//         await QuestionOption.bulkCreate(optionsData);
//       }
//     }

//     return successResponse(req, res, { message: "Daily questionnaires created successfully." });
//   } catch (error) {
//     console.error("Error creating daily questionnaire:", error);
//     return errorResponse(req, res, "An error occurred while creating the daily questionnaire.");
//   }
// };
// Assuming userId is available from authentication (e.g., from req.user or similar)
export const createDailyQuestionnaire = async (req, res) => {
  const questions = req.body;  // Expecting an array of questions
  const userId = req.user.id;  // Replace this with your actual user ID extraction logic

  // console.log("Received data:", questions);

  // Validate input data
  if (!Array.isArray(questions) || questions.length === 0) {
    return errorResponse(req, res, "No questions provided.");
  }

  try {
    for (const { questionText, options, type, companyId } of questions) {
      // console.log('Processing question:', { questionText, options, type, companyId });

      // Validate each question
      if (!questionText || !type || !companyId || !userId) {
        return errorResponse(req, res, "questionText, type, companyId, and userId are required.");
      }

      if (type !== "textfield" && (!options || options.length === 0)) {
        return errorResponse(req, res, "Options are required for types other than 'textfield'.");
      }

      // Check if a similar question already exists (optional)
      const existingQuestion = await DailyQuestionWithOptions.findOne({
        where: {
          questionText: Sequelize.where(Sequelize.fn("LOWER", Sequelize.col("questionText")), questionText.toLowerCase()),
          companyId,
        },
      });

      if (existingQuestion) {
        return errorResponse(req, res, "A similar question already exists for this company.");
      }

      // Create the daily question, including userId
      const newQuestion = await DailyQuestionWithOptions.create({
        questionText,   // Use questionText here
        type,
        companyId,
        userId,         // Ensure the userId is included
        options
      });
      return successResponse(req, res, newQuestion);

    }

  } catch (error) {
    console.error("Error creating daily questionnaire:", error);
    return errorResponse(req, res, "An error occurred while creating the daily questionnaire.");
  }
};

//getDailyQuestionsForCompany
export const getDailyQuestionsForCompany = async (req, res) => {
  const { companyId } = req.params;
  // console.log(companyId);

  try {
    const questionnaire = await DailyQuestionWithOptions.findAll({
      where: {
        companyId: companyId,
      },
    });
    //console.log("Questionnaire", questionnaire);
    return successResponse(req, res, questionnaire);
  } catch (error) {
    console.error("Error fetching question categories:", error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

//fetchDailyQuestionsForCompany
export const fetchDailyQuestionsForCompany = async (req, res) => {
  const { companyId } = req.params;
  // console.log(companyId);

  try {
    const questionnaire = await DailyQuestionWithOptions.findAll({
      where: {
        companyId: companyId,
      },
    });
    //console.log("Questionnaire", questionnaire);
    return successResponse(req, res, questionnaire);
  } catch (error) {
    console.error("Error fetching question categories:", error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// updateDailyQuestionForCompany
export const updateDailyQuestionForCompany = async (req, res) => {
  const { questionText, options, type, companyId } = req.body.points; // Get the data from the request body
  const {questionId} = req.body;
// console.log("compan details", req.body);
//const {id} = gamification;
// console.log( questionText, options, type, questionId);
  try {
    // Ensure the user is authenticated (middleware check)
    //const userId = req.user.id; // Assuming JWT is being used and the user ID is decoded from the token
    //const companyId = req.user.companyId; // Assuming the user's company ID is available from the token

    // Find the existing question in the database
    const existingQuestion = await DailyQuestionWithOptions.findOne({
      where: { id: questionId, companyId: companyId },
    });

    // If the question doesn't exist, return a 404 error
    if (!existingQuestion) {
      return res.status(404).json({ message: "Question not found" });
    }

    // Update the question with the new data
    existingQuestion.questionText = questionText || existingQuestion.questionText;
    existingQuestion.options = options || existingQuestion.options;
    existingQuestion.type = type || existingQuestion.type; // Ensure you update the type if needed
    existingQuestion.updatedAt = new Date(); // Set the updated timestamp

    // Save the updated question to the database
    await existingQuestion.save();

    // Send the updated question back to the client
    res.status(200).json({
      message: "Question updated successfully",
      data: existingQuestion,
    });
  } catch (error) {
    console.error("Error updating question:", error);
    res.status(500).json({ message: "Something went wrong, please try again later" });
  }
};
//deleteDailyQuestionForCompany
export const deleteDailyQuestionForCompany = async (req, res) => {
  try {
    // console.log("req.bod", req.params);
    const { id } = req.params;
    // console.log(id);
    const questionId = id;
    // console.log("questionId", questionId);

    const deletedQuestion = await DailyQuestionWithOptions.destroy({
      where: { id: questionId },
    });

    return successResponse(req, res, deletedQuestion);
  } catch (error) {
    console.error("Error deleting company question:", error);
    throw error;
  }
};