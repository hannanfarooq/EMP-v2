// import { errorResponse, successResponse } from "../../helpers";
// import { DailyQuestions } from "../../models";

// export const createDailyQuestions = async (req, res) => {
//     // const data = req.body;
//     const data = {
//         "userId": 123, // Replace with a valid user ID
//         "companyId": 456, // Replace with a valid company ID
//         "feeling": "happy", // Specify the feeling (e.g., happy, sad, anxious)
//         "anxietyLevel": 7, // Specify the anxiety level (an integer between 1 and 10)
//         "reason": "work", // Specify the reason for the feeling
//         "symptoms": "nervousness" // Specify any symptoms experienced
//     };
//     console.log("data in controller is:", data);
//     try {
//         console.log("Incoming data!!!:", data); // Debugging line
//         const question = await DailyQuestions.create(data);
//         return successResponse(req, res, question);
//     } catch (error) {
//         console.error("Error creating daily questions!!!:", error); // Log error
//         return errorResponse(req, res, "Error creating daily questions!!!");
//     }
// };
import { errorResponse, successResponse } from "../../helpers";
import db from "../../models"; // Import from the central models file

const { DailyQuestions } = db;

console.log("DailyQuestions Model:", DailyQuestions); // Add this line to log the model

export const createDailyQuestions = async (req, res) => {
  const { 
    userId,
    companyId,
    userFirstName,
    userLastName,
    userEmail,
    feeling,
    anxietyLevel,
    reason,
    symptom
  } = req.body;

  console.log("Incoming data to controller is:", req.body); // Debugging line

  try {
    const question = await DailyQuestions.create({
      userId: userId,
      companyId: companyId,
      firstName: userFirstName,
      lastName: userLastName,
      email: userEmail,
      feeling: feeling,
      anxietyLevel: anxietyLevel,
      reason: reason,
      symptom: symptom
    });

    return successResponse(req, res, question);
  } catch (error) {
    console.error("Error creating daily questions!!!:", error); // Log error
    return errorResponse(req, res, "Error creating daily questions!!!");
  }
};

// export const allUsersByCompanyId = async (req, res) => {
//     console.log("In companyAdmin controller",res);
//     try {
//       const page = req.params.page || 1;
//       const limit = 2;
  
//       const { count, rows: users } = await DailyQuestions.findAndCountAll({
//         where: {
//           role: {
//             [Op.in]: ["admin", "user"], // Filter by roles 'admin' or 'user'
//           },
//         },
//         order: [
//           ["createdAt", "DESC"],
//           ["firstName", "ASC"],
//         ],
//         offset: (page - 1) * limit,
//         limit,
//       });
  
//       const totalPages = Math.ceil(count / limit);
  
//       return successResponse(req, res, { users, totalPages });
//     } catch (error) {
//       return errorResponse(req, res, error.message);
//     }
//   };

export const allUsersByCompanyId = async (req, res) => {
  try {
    const { companyId } = req.body;
    const users = await DailyQuestions.findAll({ where: { companyId } });
    return successResponse(req, res, users);
  } catch (error) {
    return errorResponse(req, res, error);
    throw error;
  }
};
