import { errorResponse, successResponse } from "../../helpers";
import { CompanyAnnouncement } from "../../models"; // Assuming you have your Sequelize instance initialized

export const createCompanyAnnouncement = async (req, res) => {
  const data = req.body;
  // console.log(data);
  try {
    const company = await CompanyAnnouncement.create(req.body);
    return successResponse(req, res, company);
  } catch (error) {
    console.error("Error creating company:", error);
    throw error;
  }
};

export const getCompanyAnnouncement = async (req, res) => {
  try {
    const { companyId } = req.body;
    // console.log("companyId in be controller", companyId)
    const companies = await CompanyAnnouncement.findAll({ where: { companyId } });
    return successResponse(req, res, companies);
  } catch (error) {
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
    const companyId = req.body.companyId; // Assuming you have companyId in the request body
    const companyAnnouncement = await CompanyAnnouncement.findByPk(companyId);

    if (!companyAnnouncement) {
      return errorResponse(req, res, error);
      throw new Error("CompanyAnnouncement not found");
    }

    const deletedCompanyAnnouncement = await CompanyAnnouncement.destroy({
      where: { id: companyId }, // Specify the condition to identify the Announcement to delete
    });

    return successResponse(req, res, deletedCompanyAnnouncement);
  } catch (error) {
    console.error("Error deleting company Announcement:", error);
    throw error;
  }
};