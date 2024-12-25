import { errorResponse, successResponse } from "../../helpers";
import { CompanyPolicy } from "../../models"; // Assuming you have your Sequelize instance initialized

export const createCompanyPolicy = async (req, res) => {
  const data = req.body;
  try {
    const company = await CompanyPolicy.create(req.body);
    return successResponse(req, res, company);
  } catch (error) {
    console.error("Error creating company:", error);
    throw error;
  }
};

export const getCompanyPolicy = async (req, res) => {
  try {
    const { companyId } = req.body;
    console.log("companyId in be controller", companyId)
    const companies = await CompanyPolicy.findAll({ where: { companyId } });
    return successResponse(req, res, companies);
  } catch (error) {
    return errorResponse(req, res, error);
    throw error;
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
        id: req.body.id,
      },
    });
    return successResponse(req, res, policy);
  } catch (error) {
    console.error("Error updating company:", error);
    throw error;
  }
};

export const deleteCompanyPolicy = async (req, res) => {
  try {
    const companyId = req.body.companyId; // Assuming you have companyId in the request body
    const companyPolicy = await CompanyPolicy.findByPk(companyId);

    if (!companyPolicy) {
      return errorResponse(req, res, error);
      throw new Error("CompanyPolicy not found");
    }

    const deletedCompanyPolicy = await CompanyPolicy.destroy({
      where: { id: companyId }, // Specify the condition to identify the policy to delete
    });

    return successResponse(req, res, deletedCompanyPolicy);
  } catch (error) {
    console.error("Error deleting company policy:", error);
    throw error;
  }
};