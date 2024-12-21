import { errorResponse, successResponse } from "../../helpers";
import { User, Company, CompanyThread, ThreadMessage } from "../../models"; // Assuming you have your Sequelize instance initialized

export const createCompanyThread = async (req, res) => {
  try {
    const companyThread = await CompanyThread.create(req.body);
    return successResponse(req, res, companyThread);
  } catch (error) {
    return errorResponse(req, res, error);
  }
};

// Update a CompanyThread by ID
export const updateCompanyThread = async (req, res) => {
  const { id } = req.params;
  try {
    const [updated] = await CompanyThread.update(req.body, {
      where: { id },
    });
    if (updated) {
      const updatedCompanyThread = await CompanyThread.findByPk(id);
      return successResponse(req, res, updatedCompanyThread);
    }
    return errorResponse(req, res, "NO thread found against this id ");
  } catch (error) {
    return errorResponse(req, res, error);
  }
};

export const getAllCompanyThreads = async (req, res) => {
  try {
    const { companyId } = req.params;
    const companyThreads = await CompanyThread.findAll({
      include: User,
      // Include the ThreadMessage model
      where: {
        companyId: companyId,
      },
      order: [
        ["createdAt", "DESC"],
      ],
    });
    const results = [];

    // Iterate through the retrieved CompanyThread records
    for (const companyThread of companyThreads) {
      // Fetch associated ThreadMessages for each CompanyThread
      const threadMessages = await ThreadMessage.findAll({
        include: User,
        where: {
          companyThreadId: companyThread.id,
        },
      });

      // Create a new object with the CompanyThread data and associated ThreadMessages
      const resultObject = {
        companyThread,
        threadMessages: threadMessages,
      };

      // Add the resultObject to the results array
      results.push(resultObject);
    }

    // Now, the `results` array contains CompanyThread objects with their associated ThreadMessages

    return res.status(200).json(results);
  } catch (error) {
    console.log("error", error);
    return res.status(500).json({ error });
  }
};
