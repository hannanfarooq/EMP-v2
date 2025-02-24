import Joi from "joi";

export const createCompanyValidator = {
  body: {
    name: Joi.string().required(),
    description: Joi.string().required(),
    logo: Joi.string().required(),
    photo: Joi.string().required(),
    // adminEmails: Joi.string().required(),
    companyNTN: Joi.string().optional(), // Assuming National Tax Number is optional
    postalAddress: Joi.string().optional(),
    city: Joi.string().optional(),
    country: Joi.string().optional(),
    telNumber: Joi.string().optional(),
    userLimit: Joi.string().optional(),
    // companyEmail: Joi.string().email().required(), // Adding email validation
  },
};
export const updateCompanyValidator = {
  body: {
    name: Joi.string(),
    description: Joi.string(),
    logo: Joi.string(),
    photo: Joi.string(),
    // adminId: Joi.number().integer(),
  },
};
