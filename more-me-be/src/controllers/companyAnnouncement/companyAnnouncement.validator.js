import Joi from "joi";

export const createCompanyAnnouncementValidator = {
  body: {
    name: Joi.string().required(),
    description: Joi.string().required(),
    rewardPoints: Joi.number().required(),
    companyId: Joi.number().required(),

    // CompanyAnnouncementEmail: Joi.string().email().required(), // Adding email validation
  },
};
export const updateCompanyAnnouncementValidator = {
  body: {
    name: Joi.string(),
    description: Joi.string(),
    rewardPoints: Joi.number(),
    companyId: Joi.number(),
  },
};
