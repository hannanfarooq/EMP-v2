import Joi from "joi";

export const createCompanyPolicyValidator = {
  body: {
    name: Joi.string().required(),
    description: Joi.string().required(),
    rewardPoints: Joi.number().required(),
    companyId: Joi.number().required(),

    // CompanyPolicyEmail: Joi.string().email().required(), // Adding email validation
  },
};
export const updateCompanyPolicyValidator = {
  body: {
    name: Joi.string(),
    description: Joi.string(),
    rewardPoints: Joi.number(),
    companyId: Joi.number(),
  },
};
