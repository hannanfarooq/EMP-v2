import express from "express";
import validate from "express-validation";

import * as userController from "../controllers/user/user.controller";
import * as buyAndSellController from "../controllers/buyAndSell/buyAnsSell.controller";
import * as questionController from "../controllers/question/question.controller";
import * as userValidator from "../controllers/user/user.validator";
import * as gamificationController from "../controllers/gamifications/gamification.controller"
import * as functionController from "../controllers/function/function.controller";
import * as teamController from "../controllers/team/team.controller";
import * as departmentController from "../controllers/department/department.controller";
import { getCompanyPolicy } from "../controllers/companyPolicy/companyPolicy.controller";
import { getCompanyAnnouncement } from "../controllers/companyAnnouncement/companyAnnouncement.controller"
//import { postMessage, getConversations, getMessagesByConversationId, createConversation } from "../controllers/chat/chat.controller";
import { createDailyQuestions } from "../controllers/question/dailyquestions.controller";
import {createStartUpQuestions} from "../controllers/question/startupquestions";
import { getAllStartUpQuestionsByCompanyIdAndUserId } from "../controllers/question/startupquestions";
import {createConversation,getConversationById,addUserToConversation,removeUserFromConversation,getConversationsForUser} from '../controllers/chat/chat';
import {createMessage,getMessagesByConversationId,markMessageAsRead}  from '../controllers/message/message';
import {createInvitation,respondToInvitation,getInvitationsByUserId}  from '../controllers/invitation/invitation';
import { GetBlockUser, GetBlockedByUsers, blockUsers, unblockUsers } from "../controllers/chat/block";

const router = express.Router();

//= ===============================
// API routes
//= ===============================
router.get("/me", userController.profile);
router.post(
  "/changePassword",
  validate(userValidator.changePassword),
  userController.changePassword
);
router.post("/inviteUsersCSV", userController.bulkInviteUsers);
router.post("/getCompanyPolicy", getCompanyPolicy);
router.post("/getCompanyAnnouncement", getCompanyAnnouncement);
router.post("/updateUserPoints", userController.updateUserPoints);
router.post("/updateUserQuestionnaire", userController.updateUserQuestionnaire);
router.post("/updateStartUpQuestions", userController.updateStartUpQuestions);
router.post("/getUserProfile", userController.profile);
router.post("/createQuestions", questionController.createQuestions);
router.post("/addQuestionCategory", questionController.addQuestionCategory);
router.get("/getQuestionCategories/:companyId", questionController.getQuestionCategories);
router.delete("/deleteQuestionCategory/:categoryId", questionController.deleteQuestionCategory);
router.post("/getCompanyQuestions", questionController.getCompanyQuestions);
router.post("/updateCategoryName", questionController.updateCategoryName);
router.delete("/deleteCompanyQuestion", questionController.deleteCompanyQuestion);
//daily question routing
router.post("/createDailyQuestions", createDailyQuestions);
//startup questions routing
router.post("/createStartUpQuestions", createStartUpQuestions);
// get all daily questions based on company id
router.post("/getAllStartUpQuestionsByCompanyIdAndUserId", getAllStartUpQuestionsByCompanyIdAndUserId);

//get all questionnaire for user based on specific company
router.get("/getUserQuestionnaire/:companyId", questionController.getUserQuestionnaire);
// getUserDynamicQuestions
router.get("/getUserDynamicQuestions/:questionnaireId", questionController.getUserDynamicQuestions);
//getDynamicQuestions
router.get("/getDynamicQuestions/:questionnaireId", questionController.getDynamicQuestions);
//createUserAttemptQuestionnaire
router.post("/createUserAttemptQuestionnaire", questionController.createUserAttemptQuestionnaire);
//getUserAttemptedQuestionnaire
router.get("/getUserAttemptedQuestionnaire/:companyId", questionController.getUserAttemptedQuestionnaire);


router.post('/addSellItem', buyAndSellController.addItem);
router.delete('/DeleteBuyandSell/:id',buyAndSellController.deleteBuyAndSell)
router.get('/getSellingItems/:companyId', buyAndSellController.getItemsByCompanyId);
router.post('/updateSellItem/:id', buyAndSellController.updateBuyAndSell);

// gamifications routes
router.post("/createGamifications", gamificationController.createGamifications);
router.post("/getGamifications", gamificationController.getCompanyGamifications);
router.post("/updateUserGamification", gamificationController.updateUserGamification);
router.get("/GetUserGamification/:id", gamificationController.GetUserGamification);
router.get("/GetUserGamificationbycompany/:companyId", gamificationController.GetUserGamificationbyCompany);

// function routes
router.post("/createFunction", functionController.createFunction);
router.post("/getCompanyFunctions", functionController.getCompanyFunctions);
router.post("/updateFunction", functionController.updateFunction);
router.delete("/deleteFunction", functionController.deleteFunction);

// department routes
router.post("/createDepartment", departmentController.createDepartment);
router.post("/getFunctionDepartments", departmentController.getFunctionDepartments);
router.post("/updateDepartment", departmentController.updateDepartment);
router.delete("/deleteDepartment", departmentController.deleteDepartment);

// Team routes
router.post("/createTeam", teamController.createTeam);
router.post("/getDepartmentTeams", teamController.getDepartmentTeams);
router.post("/updateTeam", teamController.updateTeam);
router.delete("/deleteTeam", teamController.deleteTeam);
router.post("/getTeamMembers", teamController.getTeamMembers);

router.get('/getArticles', buyAndSellController.fetchArticles);

//router.post('/createConversation', createConversation);
//router.post('/postMessage', postMessage);
//router.get('/getConversations/:userId', getConversations);
//router.get('/getConversationMessages', getMessagesByConversationId);
router.post ('/updateUserProfile',userController.updateUser);
router.post('/UpdateUserFromStartUpQuestions', userController.UpdateUserFromStartUpQuestions);
router.post ('/changeUserPassword2',userController.changePassword);

//one to one , Group Chat Routes
router.post('/conversations', createConversation);
router.get('/conversations/:id', getConversationById);
router.post('/conversations/addUser/:id', addUserToConversation);
router.post('/conversations/removeUser/:id', removeUserFromConversation);
router.get('/getConversations/:userId', getConversationsForUser);
// Message routes
router.post('/messages', createMessage);
router.get('/messages/:chatId', getMessagesByConversationId);
router.post('/messages/read/:id', markMessageAsRead);
router.post(`/getAllUserByCompanyId`,userController.getAllUserByCompanyId);
// Invitation routes
router.post('/invitations', createInvitation);
router.post('/invitations/:id', respondToInvitation);
router.get('/invitations/user/:userId', getInvitationsByUserId);
// Blocking User
router.post('/BlockUser',blockUsers);
router.post('/unblockUser',unblockUsers);
router.get('/getblockuser/:id',GetBlockUser);
router.get('/blockedByUsers/:id', GetBlockedByUsers);

//dail user question routes
// getDailyQuestionsForCompany
router.get("/getDailyQuestionsForCompany/:companyId", questionController.getDailyQuestionsForCompany);

module.exports = router;