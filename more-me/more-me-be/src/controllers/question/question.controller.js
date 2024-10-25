import { Sequelize } from "sequelize";
import { errorResponse, successResponse } from "../../helpers";
import { Question, QuestionCategory, Questionnaire, DynamicQuestionnaire, UserAttemptedQuestionnaire } from "../../models"; // Assuming you have your Sequelize instance initialized

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
  console.log("getUserAttemptedQuestionnaireToAdmin be controller", questionnaireId, companyId);

  try {
    const questions = await UserAttemptedQuestionnaire.findAll({
      where: {
        questionnaireId,
        companyId,
      },
    });

    return successResponse(req, res, { questions });
  } catch (error) {
    console.log("error in getUserAttemptedQuestionnaireToAdmin");
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
    console.log("questionId", questionId);

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
  const { name, companyId } = req.body;
  try {
    const existingCategory = await QuestionCategory.findOne({
      where: {
        name: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('name')), name.toLowerCase()),
        companyId,
      },
    });

    if (existingCategory) {
      return errorResponse(req, res, "Category with the same name already exists for this company.");
    }

    const newCategory = await QuestionCategory.create({
      name,
      companyId,
      img: null,
    });

    return successResponse(req, res, newCategory);
  } catch (error) {
    console.error("Error adding question category:", error);
    throw error;
    
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