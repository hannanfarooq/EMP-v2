import express from "express";
import * as userController from "../controllers/user/user.controller";
import * as questionController from "../controllers/question/question.controller";
import { createCompanyPolicyValidator } from "../controllers/companyPolicy/companyPolicy.validator";

import { createCompanyAnnouncementValidator } from "../controllers/companyAnnouncement/companyAnnouncement.validator";
import { allUsersByCompanyId } from "../controllers/question/dailyquestions.controller";
import validate from "express-validation";
import {
  createCompanyPolicy,
  deleteCompanyPolicy,
  getCompanyPolicy,
  updateCompanyPolicy,
} from "../controllers/companyPolicy/companyPolicy.controller";

import {
  createCompanyAnnouncement,
  deleteCompanyAnnouncement,
  getCompanyAnnouncement,
  updateCompanyAnnouncement,
} from "../controllers/companyAnnouncement/companyAnnouncement.controller";
import { updateCompanyPolicyValidator } from "../controllers/companyPolicy/companyPolicy.validator";

import { updateCompanyAnnouncementValidator } from "../controllers/companyAnnouncement/companyAnnouncement.validator";

const router = express.Router();

//= ===============================
//  Admin routes
//= ===============================

//company Poilcy Crud
router.post("/allCompanyPolicy", getCompanyPolicy);
router.delete("/deleteCompanyPolicy", deleteCompanyPolicy);
router.post(
  "/updateCompanyPolicy",
  validate(updateCompanyPolicyValidator),
  updateCompanyPolicy
);
router.post(
  "/createCompanyPolicy",
  validate(createCompanyPolicyValidator),
  createCompanyPolicy
);
//company Announcement Crud
router.post("/allCompanyAnnouncement", getCompanyAnnouncement);
router.delete("/deleteCompanyAnnouncement", deleteCompanyAnnouncement);
router.post(
  "/updateCompanyAnnouncement",
  validate(updateCompanyAnnouncementValidator),
  updateCompanyAnnouncement
);
router.post(
  "/createCompanyAnnouncement",
  validate(createCompanyAnnouncementValidator),
  createCompanyAnnouncement
);

// get all daily questions based on company id
router.post("/getAllDailyQuestionsByCompanyId", allUsersByCompanyId);

//COMPANY USER CRUD
router.post("/getAllUserByCompanyId", userController.getAllUserByCompanyId);
router.get("/getAllAdmins", userController.getAllAdmins);
router.post("/updateUser", userController.updateUser);
router.delete("/deleteUserById", userController.deleteUserById);
//deleteDynamicQuestion
router.delete("/deleteDynamicQuestion", questionController.deleteDynamicQuestion);

//get all questionnaire based on specific company
router.get("/getQuestionnaire/:companyId", questionController.getQuestionnaire);
//getDynamicQuestions
router.get("/getDynamicQuestions/:questionnaireId", questionController.getDynamicQuestions);
//getUserByCompany
//router.get("/getUserByCompany", );
//router of create new questionnaire
router.post("/createQuestionnaire", questionController.createQuestionnaire);
//router to update the toggle button
router.post("/updateQuestionnaireIsReady", questionController.updateQuestionnaireIsReady);
//updateQuestionnaireIsLive
router.post("/updateQuestionnaireIsLive", questionController.updateQuestionnaireIsLive);
//handleUpdateQuestionnaireTitleAndDescription
router.post("/handleUpdateQuestionnaireTitleAndDescription", questionController.handleUpdateQuestionnaireTitleAndDescription);
//createDynamicQuestion
router.post("/createDynamicQuestion", questionController.createDynamicQuestion);
//getUserAttemptedQuestionnaireToAdmin
router.get("/getUserAttemptedQuestionnaireToAdmin", questionController.getUserAttemptedQuestionnaireToAdmin);

//router of create new daily questionnaire
router.post("/createDailyQuestionnaire", questionController.createDailyQuestionnaire);
router.get("/fetchDailyQuestionsForCompany/:companyId", questionController.fetchDailyQuestionsForCompany);
// updateDailyQuestionForCompany
router.post("/updateDailyQuestionForCompany", questionController.updateDailyQuestionForCompany);
//deleteDailyQuestionForCompany
router.delete("/deleteDailyQuestionForCompany/:id", questionController.deleteDailyQuestionForCompany);

module.exports = router;
