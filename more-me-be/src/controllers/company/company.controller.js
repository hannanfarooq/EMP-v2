import { errorResponse, successResponse } from "../../helpers";
import { User, Company } from "../../models"; // Assuming you have your Sequelize instance initialized
import { createUser } from "../user/user.controller";
const { Op } = require("@sequelize/core");

export const createCompany = async (req, res) => {
  // console.log("create company req: ", req.body);
  const { adminEmails } = req.body;

  const adminIds = [];

  try {
    // Create the company first without adminId
    const company = await Company.create({
      name: req.body.name,
      description: req.body.description,
      logo: req.body.logo,
      photo: req.body.photo,
      ntn: req.body.companyNTN,
      postalAddress: req.body.postalAddress,
      city: req.body.city,
      country: req.body.country,
      companyEmail: "contact@gmail.com",
      telephone: req.body.telNumber,
      userLimit: req.body.userLimit,
    });

    const companyId = company.dataValues.id; // Get the auto-generated companyId

    // Create users with the companyId
    const data = await Promise.all(
      adminEmails.map((admin) => createUser(admin, "admin", "","", companyId))
    );

    data.map((e) => {
      // console.log(e.data.dataValues.id);
      // eslint-disable-next-line radix
      adminIds.push(parseInt(e.data.dataValues.id));
    });

    if (adminIds.length) {
      // console.log("req.body of company creation:", req.body);
      // Update the company with adminIds
      await Company.update(
        { adminId: adminIds },
        { where: { id: companyId } }
      );

      // Fetch the updated company
      const updatedCompany = await Company.findOne({ where: { id: companyId } });

      return successResponse(req, res, updatedCompany);
    }
    return errorResponse(req, res);
  } catch (error) {
    console.error("Error creating company:", error);
    return errorResponse(req, res, error.message);
  }
};



export const getAllUsers = async (req, res) =>{
  try {
    const users = await User.findAll();
    return successResponse(req, res, users);
  } catch (error) {
    return errorResponse(req, res, error);
  }
}

export const getCompanies = async (req, res) => {
  try {
    const companies = await Company.findAll();
    return successResponse(req, res, companies);
  } catch (error) {
    return errorResponse(req, res, error);
  }
};

export const getCompanyById = async (req, res) => {
  try {
    const { companyId } = req.body;

    // console.log("company", companyId);

    const company = await Company.findByPk(companyId);

    // console.log(company);
    return successResponse(req, res, company);
  } catch (error) {
    return errorResponse(req, res, error);
  }
};

export const updateCompany = async (req, res) => {
  try {
    const companyId = req.body.companyValues.id;
    const company = await Company.findByPk(companyId);
    if (!company) {
      return errorResponse(req, res, !company);
    }
    await company.update(req.body.companyValues);
    return successResponse(req, res, company);
  } catch (error) {
    console.error("Error updating company:", error);
    throw error;
  }
};

export const deleteCompany = async (req, res) => {
  try {
    const company = await Company.findByPk(req.body.companyId);
    if (!company) {
      return errorResponse(req, res, error);
    }
    const companydata = await company.destroy();
    return successResponse(req, res, companydata);
  } catch (error) {
    console.error("Error deleting company:", error);
    throw error;
  }
};
export const getCompanyByAdminId = async (req, res) => {
  try {
    const { adminId } = req.body;
    const company = await Company.findOne({
      where: {
        adminId,
      },
      include: [
        {
          model: User,
          as: "admin",
        },
      ],
    });
    return successResponse(req, res, company);
  } catch (error) {
    console.error("Error fetching company by admin ID:", error);
    throw error;
  }
};

export const getAdminCompany = async (id) => {
  try {
    const company = await Company.findOne({
      where: { adminId: { [Op.contains]: [id] } },
    });
    return company;
  } catch (error) {
    console.error("Error fetching company by admin ID:", error);
    throw error;
  }
};
export const FetchCompanyDataByid = async (id) => {
  try {
    const companyId = id; // Use req.params.companyId

    const company = await Company.findByPk(companyId);
    return company;
  } catch (error) {
    throw error;
  }
};
