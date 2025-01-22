import { errorResponse, successResponse } from "../../helpers";
import { CompanyAnnouncement,AnnouncementResponse } from "../../models"; // Assuming you have your Sequelize instance initialized

import { AnnouncementQuestion } from '../../models'; // Import your models

export const createCompanyAnnouncement = async (req, res) => {
  const data = req.body;
  const { name, description, rewardPoints, documentUrls, imageUrls, announcementDate, companyId, questions } = data;

  try {
    // Create the Company Announcement
    const companyAnnouncement = await CompanyAnnouncement.create({
      name,
      description,
      rewardPoints,
      documentUrls,
      imageUrls,
      announcementDate,
      companyId,
    });

    // Check if there are any questions to create
    if (questions && Array.isArray(questions) && questions.length > 0) {
      // Create Announcement Questions
      const questionsData = questions.map(question => ({
        question: question.question,
        announcementId: companyAnnouncement.id,
        options: question.options || [],
        isVisible: question.isVisible !== undefined ? question.isVisible : true,
      }));

      // Bulk create Announcement Questions
      await AnnouncementQuestion.bulkCreate(questionsData);
    }

    // Return success response with the created company announcement
    return successResponse(req, res, companyAnnouncement);
  } catch (error) {
    console.error("Error creating company announcement and questions:", error);
    return errorResponse(req, res, 'Error creating company announcement and questions');
  }
};


export const getCompanyAnnouncement = async (req, res) => {
  try {
    const { companyId } = req.body;

    // Fetch announcements along with associated questions
    const companies = await CompanyAnnouncement.findAll({
      where: { companyId },
      include: [
        {
          model: AnnouncementQuestion, // Assuming you have a Question model
          as: 'questions', // Alias for the association
          required: false, // To allow fetching announcements even if no questions are associated
        },
      ],
    });

    // Return the announcements with their associated questions
    return successResponse(req, res, companies);
  } catch (error) {
    console.log("ANNOUCEMENT ERROR",error);
    return errorResponse(req, res, error);
    throw error;
  }
};

export const updateCompanyAnnouncement = async (req, res) => {
  try {
    const Announcement = await CompanyAnnouncement.findByPk(req.body.id);
    if (!Announcement) {
      return errorResponse(req, res, !Announcement);
      throw new Error("CompanyAnnouncementnot found");
    }
    await CompanyAnnouncement.update(req.body, {
      where: {
        id: req.body.id,
      },
    });
    return successResponse(req, res, Announcement);
  } catch (error) {
    console.error("Error updating company:", error);
    throw error;
  }
};

export const deleteCompanyAnnouncement = async (req, res) => {
  try {
    const id = req.body.id; // Assuming you have companyId in the request body
    const companyAnnouncement = await CompanyAnnouncement.findByPk(id);

    if (!companyAnnouncement) {
      return errorResponse(req, res, "CompanyAnnouncement not found");
    }

    // Fetch all related AnnouncementQuestions
    const relatedQuestions = await AnnouncementQuestion.findAll({
      where: { announcementId: id },
    });

    if (relatedQuestions.length > 0) {
      // Extract question IDs
      const questionIds = relatedQuestions.map((question) => question.id);

      // Delete all AnnouncementResponses related to these questions
      await AnnouncementResponse.destroy({
        where: { questionId: questionIds },
      });

      // Delete all AnnouncementQuestions related to the announcement
      await AnnouncementQuestion.destroy({
        where: { announcementId: id },
      });
    }

    // Delete the CompanyAnnouncement
    const deletedCompanyAnnouncement = await CompanyAnnouncement.destroy({
      where: { id: id },
    });

    return successResponse(req, res, deletedCompanyAnnouncement);
  } catch (error) {
    console.error("Error deleting company announcement:", error);
    return errorResponse(req, res, "Failed to delete company announcement");
  }
};


export const toggleVisibility = async (req, res) => {
// Assuming you pass the announcement ID in the URL
  const { id,isVisible } = req.body; // The new visibility status is passed in the request body

  try {
    // Find the announcement by ID
    const announcement = await CompanyAnnouncement.findByPk(id);

    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found' });
    }

    // Update the 'isVisible' status
    announcement.isVisible =  !announcement.isVisible;

    // Save the updated record
    await announcement.save();

    // Return success response
    return res.status(200).json({
      message: 'Announcement visibility updated successfully',
      announcement: {
        id: announcement.id,
        name: announcement.name,
        isVisible: announcement.isVisible,
      },
    });
  } catch (error) {
    console.error("ERROR VISIBLE : ",error);

    return res.status(500).json({ message: 'Internal server error' });
  }
};


export const saveAnswers = async (req, res) => {
  const { userId, answers } = req.body; // Extract userId and answers from the request body

  if (!userId || !answers || typeof answers !== 'object') {
    return res.status(400).json({ error: 'Invalid data provided' });
  }

  try {
    // Map over the answers object and save each response
    const responses = await Promise.all(
      Object.entries(answers).map(async ([questionId, response]) => {
        // Ensure the response is valid JSON
        const jsonResponse = typeof response === 'string' ? JSON.stringify(response) : response;

        return AnnouncementResponse.create({
          userId,
          questionId: parseInt(questionId, 10), // Ensure questionId is an integer
          response: jsonResponse, // Save as JSON
        });
      })
    );

    return successResponse(req, res, responses);
  } catch (error) {
    console.error('Error saving answers:', error);
    return res.status(500).json({
      error: 'An error occurred while saving answers',
    });
  }
};


export const getResponsesByUserId = async (req, res) => {
  const { userId } = req.body; // Extract userId from the request parameters

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  try {
    // Fetch responses associated with the userId
    const responses = await AnnouncementResponse.findAll({
      where: { userId },
     
    });

   

    return successResponse(req, res, 
     
     responses
    );
  } catch (error) {
    console.error('Error fetching responses:', error);
    return errorResponse(req, res, 'An error occurred while fetching responses');
  }
};


export const getAnnouncementStats = async (req, res) => {
  try {
    const { announcementId } = req.body;

    // Fetch the announcement to ensure it exists
    const announcement = await CompanyAnnouncement.findByPk(announcementId);
    if (!announcement) {
      return res.status(404).json({ message: "Announcement not found" });
    }

    // Fetch all questions for the announcement
    const questions = await AnnouncementQuestion.findAll({
      where: { announcementId },
    });

    if (questions.length === 0) {
      return res.status(404).json({ message: "No questions found for this announcement" });
    }

    // Prepare response data structure
    const stats = [];

    // Process each question to gather response statistics
    for (const question of questions) {
      // Fetch responses for the current question
      const responses = await AnnouncementResponse.findAll({
        where: { questionId: question.id },
      });

      // Initialize a count object for the options
      const optionCounts = question.options.reduce((acc, option) => {
        acc[option] = 0; // Set count to 0 for each option
        return acc;
      }, {});

      // Count responses for each option
      responses.forEach((response) => {
        if (optionCounts[response.response] !== undefined) {
          optionCounts[response.response]++;
        }
      });

      // Format the question and response data for graph/chart
      stats.push({
        question: question.question,
        options: question.options,
        counts: optionCounts,
      });
    }

    return successResponse(req, res, stats);
  } catch (error) {
    console.error("Error fetching announcement stats:", error);
    return res.status(500).json({ message: "An error occurred", error: error.message });
  }
};