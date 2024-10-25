import jwt from "jsonwebtoken";
import crypto from "crypto";
import axios from "axios";
import { User } from "../../models";
import { successResponse, errorResponse, uniqueId } from "../../helpers";
import { sendEMail } from "../../helpers/mailer";
import { Op } from "sequelize";

import { faker } from "@faker-js/faker";
import {
  FetchCompanyDataByid,
  getAdminCompany,
  getCompanyById,
} from "../company/company.controller";

import db from "../../models"; // Import from the central models file

const { StartUpQuestions } = db;

// Function to generate a random OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Function to generate a token expiration date (e.g., 1 hour from now)
function generateTokenExpiration() {
  return new Date(Date.now() + 3600000); // 1 hour
}

export const allUsers = async (req, res) => {
  try {
    const page = req.params.page || 1;
    const limit = 2;

    const { count, rows: users } = await User.findAndCountAll({
      where: {
        role: {
          [Op.in]: ["admin", "user"], // Filter by roles 'admin' or 'user'
        },
      },
      order: [
        ["createdAt", "DESC"],
        ["firstName", "ASC"],
      ],
      offset: (page - 1) * limit,
      limit,
    });

    const totalPages = Math.ceil(count / limit);

    return successResponse(req, res, { users, totalPages });
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};

export const sendEmail = async (req, res) => {
  try {
    let sender_email = `hannanfarooq8195@gmail.com`;
    let receiver_email = "hannanfarooq8195@gmail.com";
    let email_subject = "Message From Contact Us";
    let email_body = `${req.body.name}  ${req.body.email} ${req.body.message}`;

    const email = sendEMail(
      sender_email,
      receiver_email,
      email_subject,
      email_body
    );
    return successResponse(req, res, email);
  } catch (error) {}
};

export const createUser = async (email, role, firstName, lastName, companyId) => {
  console.log("companyId: ", companyId);
  try {
    const existingUser = await User.findOne({ where: { email: email } });
    if (existingUser) {
      console.error("Email already exists in the database");
      return { data: null, isCreated: false };
    }

    let randomPassword = faker.internet.password();
    const password = crypto
      .createHash("md5")
      .update(randomPassword)
      .digest("hex");

    const user = await User.create({
      email: email,
      role: role,
      password: password,
      firstName: firstName,
      lastName: lastName,
      companyId: companyId,
    });
    console.log("Company user data", email, companyId);

    let sender_email = `hannanfarooq8195@gmail.com`;
    let receiver_email = email;
    let email_subject = "Invitation to Join!";
    let email_body = `Your email to login is ${email} and password is ${randomPassword}`;
    console.log("EMAIL BODY", email_body);
    sendEMail(sender_email, receiver_email, email_subject, email_body);

    return { data: user, isCreated: true };
  } catch (error) {
    console.error("Error creating user and sending email:", error);
    return { data: null, isCreated: false };
  }
};

export const bulkInviteUsers = async (req, res) => {
  const builkInvite = req.body;
  console.log("builkInvite",builkInvite);
  console.log(">>>>>>>  ", JSON.stringify(builkInvite.companyId));

  // return successResponse(req, res, {});

  //fix exitsing user
  const users = await User.findAll({
    where: {
      companyId: builkInvite.companyId,
    },
  });

  const resp = FetchCompanyDataByid(builkInvite.companyId);

  if (resp.userLimit <= builkInvite.users.length + users.length) {
    return errorResponse(req, res, "Comapny user's limit reached.");
  }
  const data = builkInvite.users.map((user) =>
    createUser(
      user.email,
      user.role,
      user.firstName,
      user.lastName,
      builkInvite.companyId
    )
  );
  console.log("data from csv", data);
  return successResponse(req, res, {});
};

export const register = async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;
    if (process.env.IS_GOOGLE_AUTH_ENABLE === "true") {
      if (!req.body.code) {
        throw new Error("code must be defined");
      }
      const { code } = req.body;
      const customUrl = `${process.env.GOOGLE_CAPTCHA_URL}?secret=${process.env.GOOGLE_CAPTCHA_SECRET_SERVER}&response=${code}`;
      const response = await axios({
        method: "post",
        url: customUrl,
        data: {
          secret: process.env.GOOGLE_CAPTCHA_SECRET_SERVER,
          response: code,
        },
        config: { headers: { "Content-Type": "multipart/form-data" } },
      });
      if (!(response && response.data && response.data.success === true)) {
        throw new Error("Google captcha is not valid");
      }
    }

    const user = await User.scope("withSecretColumns").findOne({
      where: { email },
    });
    if (user) {
      throw new Error("User already exists with same email");
    }
    const reqPass = crypto.createHash("md5").update(password).digest("hex");
    const payload = {
      email,
      firstName,
      lastName,
      password: reqPass,
      isVerified: false,
      verifyToken: uniqueId(),
    };

    const newUser = await User.create(payload);
    return successResponse(req, res, {});
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};

export const login = async (req, res) => {
  try {
    const user = await User.scope("withSecretColumns").findOne({
      where: { email: req.body.email },
    });

    console.log("---------", user);

    if (!user) {
      throw new Error("Incorrect Email Id/Password");
    }
    const reqPass = crypto
      .createHash("md5")
      .update(req.body.password || "")
      .digest("hex");
    if (reqPass !== user.password) {
      throw new Error("Incorrect Email Id/Password");
    }
    const token = jwt.sign(
      {
        user: {
          userId: user.id,
          email: user.email,
          role: user.role,
          createdAt: new Date(),
        },
      },
      process.env.SECRET
    );
    delete user.dataValues.password;
    let company;

    if (user.role == "admin") {
      company = await getAdminCompany(user.id);
    }
    if (user.role == "user" && user.companyId) {
      company = await FetchCompanyDataByid(user.companyId);
    }

    return successResponse(req, res, {
      user,
      token,
      company: company ? company : null,
    });
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};

export const forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.scope("withSecretColumns").findOne({
      where: { email: email },
    });

    if (!user) {
      throw new Error("User Doesn't Exist");
    }
    if (user) {
      const resetToken = generateOTP();
      const resetTokenExpires = generateTokenExpiration();
      await user.update({
        resetToken,
        resetTokenExpires,
      });
      let sender_email = `hannanfarooq8195@gmail.com`;
      let receiver_email = email;
      let email_subject = "Updated Password to login!";
      let email_body = `Your one time OTP is  ${resetToken}`;

      sendEMail(sender_email, receiver_email, email_subject, email_body);
      const resp = "OTP Send to email";
      return successResponse(req, res, resp);
    }
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};

export const profile = async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await User.findOne({ where: { id: userId } });
    return successResponse(req, res, { user });
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};

export const changePassword = async (req, res) => {
  console.log("in change password")
  try {
    const { userId } = req.user;
    const user = await User.scope("withSecretColumns").findOne({
      where: { id: userId },
    });

    const reqPass = crypto
      .createHash("md5")
      .update(req.body.oldPassword)
      .digest("hex");
    if (reqPass !== user.password) {
      console.log("hello this is invalid ")
   return   errorResponse(req, res,"Old password is incorrect")
      throw new Error("Old password is incorrect");
    }

    const newPass = crypto
      .createHash("md5")
      .update(req.body.newPassword)
      .digest("hex");

  const data =  await User.update({ password: newPass }, { where: { id: user.id } });
    return successResponse(req, res, data);
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};

export const getAllUserByCompanyId = async (req, res) => {
  try {
    const { companyId } = req.body;

    const users = await User.findAll({
      where: {
        companyId: companyId,
      },
    });

    return successResponse(req, res, users);
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};

export const getAllAdmins = async (req, res) => {
  try {
    const admins = await User.findAll({
      where: {
        role: "admin",
      },
    });

    return successResponse(req, res, admins);
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.body;
    const data = req.body;
    const user = await User.findByPk(id);

    if (!user) {
      throw new Error("User not found");
    }

    // Update the user's data
    const updated = await user.update(data);

    return successResponse(req, res, updated);
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};
//UpdateUserFromStartUpQuestions
const validateDate = (date) => {
  return date && !isNaN(Date.parse(date)) ? new Date(date).toISOString() : null;
};

export const UpdateUserFromStartUpQuestions = async (req, res) => {
  try {
    const data = req.body;

    // Prepare data
    data.ageRange = data.ageRange.replace(/\s+/g, ''); // Clean enum value
    data.dateOfBirth = validateDate(data.dateOfBirth); // Validate date
    data.spouseDOB = validateDate(data.spouseDOB); // Validate date
    console.log("data.userd========", data);
    // Update user
    const user = await User.findByPk(data.userId);
    if (!user) {
      throw new Error("User not found");
    }

    const updated = await user.update(data);
    return res.json(updated); // Respond with updated user

  } catch (error) {
    console.error("Update error:", error);
    return res.status(400).json({ error: error.message });
  }
};




export const deleteUserById = async (req, res) => {
  try {
    const { id } = req.body;

    const user = await User.findByPk(id);

    if (!user) {
      throw new Error("User not found");
    }

    // Delete the user
    const resp = await user.destroy();

    return successResponse(req, res, resp);
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};

export const updateUserPoints = async (req, res) => {
  try {
    // Find the user by their ID
    const user = await User.findByPk(req.body.userId);

    if (!user) {
      throw new Error("User not found");
    }

    // Update the user's points
    if (req.body.userRewards) {
      user.userRewards = user.userRewards + req.body.userRewards;
    }

    // Update the readPolicies data (assuming readPolicies is an array)
    if (req.body.userPolicyId) {
      console.log("is trye");
      let userpolicy = [];
      userpolicy = user.readPolicies ? user.readPolicies : [];
      userpolicy.push(req.body.userPolicyId);
      user.readPolicies = userpolicy;
    }

    console.log(user.readPolicies);
    // Save the changes to the database
    const resp = await user.save();
    return successResponse(req, res, resp);
  } catch (error) {
    return errorResponse(req, res, error);
    throw error;
  }
};

export const updateUserQuestionnaire = async (req, res) => {
  try {
    // Find the user by their ID
    console.log(req.body);
    const { questionare, id } = req.body;
    const user = await User.findByPk(id);

    if (!user) {
      throw new Error("User not found");
    }

    // Update the user's questionnaire
    if (questionare) {
      user.questionnaire = questionare;
    }

    // Save the changes to the database
    const resp = await user.save();
    return successResponse(req, res, resp);
  } catch (error) {
    return errorResponse(req, res, error);
    throw error;
  }
};

//updateStartUpQuestions
export const updateStartUpQuestions = async (req, res) => {
  try {
    const { userId, companyId, ...data } = req.body;

    // Validate input
    if (!userId || !companyId) {
      throw new Error("userId and companyId are required");
    }

    // Process and format comma-separated fields
    if (data.hobbies) {
      data.hobbies = Array.isArray(data.hobbies) ? data.hobbies.join(',') : data.hobbies;
    }
    if (data.interestTopics) {
      data.interestTopics = Array.isArray(data.interestTopics) ? data.interestTopics.join(',') : data.interestTopics;
    }
    if (data.contentPreferences) {
      data.contentPreferences = Array.isArray(data.contentPreferences) ? data.contentPreferences.join(',') : data.contentPreferences;
    }

    console.log("Received data:", data);
    console.log("UserId:", userId, "CompanyId:", companyId);

    // Find the user's record based on userId and companyId
    const userRecord = await StartUpQuestions.findOne({
      where: {
        userId: userId,
        companyId: companyId,
      },
    });

    if (!userRecord) {
      throw new Error("User not found");
    }

    console.log("User record found, updating...");

    // Update the user's data
    const updated = await userRecord.update(data);

    console.log("User record updated:", updated);

    return successResponse(req, res, updated);
  } catch (error) {
    console.error("Error updating user record:", error.message);
    return errorResponse(req, res, error.message);
  }
};


export const verifyToken = async (req, res) => {
  try {
    const { email, token } = req.body;
    const user = await User.scope("withSecretColumns").findOne({
      where: { email: email },
    });

    if (!user) {
      throw new Error("User Doesn't Exist");
    }
    if (user) {
      if (
        user &&
        user.resetToken === token &&
        user.resetTokenExpires > new Date()
      ) {
        return successResponse(req, res, "good");
      } else {
        errorResponse(req, res, "Wrong Token / Token Has Expired");
      }
    }
  } catch (error) {
    return errorResponse(req, res, error);
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, token, newPassword } = req.body;
    const user = await User.scope("withSecretColumns").findOne({
      where: { email: email },
    });

    if (!user) {
      throw new Error("User Doesn't Exist");
    }
    if (user) {
      if (
        user &&
        user.resetToken === token &&
        user.resetTokenExpires > new Date()
      ) {
        const newPass = crypto
          .createHash("md5")
          .update(newPassword)
          .digest("hex");

     const userdata=   await user.update(
          { password: newPass, resetToken: null, resetTokenExpires: null },
          { where: { id: user.id } }
        );
    
        return successResponse(req, res, userdata);
    
      } else {
        errorResponse(req, res, "Wrong Token / Token Has Expired");
      }
    }
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};
