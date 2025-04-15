import express from "express";
import validate from "express-validation";
import * as userole from "../controllers/user/user.role";
import * as userController from "../controllers/user/user.controller";
import * as buyAndSellController from "../controllers/buyAndSell/buyAnsSell.controller";
import * as questionController from "../controllers/question/question.controller";
import * as userValidator from "../controllers/user/user.validator";
import * as gamificationController from "../controllers/gamifications/gamification.controller"
import * as functionController from "../controllers/function/function.controller";
import * as teamController from "../controllers/team/team.controller";
import * as departmentController from "../controllers/department/department.controller";
import { getCompanyPolicy } from "../controllers/companyPolicy/companyPolicy.controller";
import { getAnnouncementStats, getCompanyAnnouncement, getCompanyAnnouncementforuser, getResponsesByUserId, saveAnswers } from "../controllers/companyAnnouncement/companyAnnouncement.controller"
//import { postMessage, getConversations, getMessagesByConversationId, createConversation } from "../controllers/chat/chat.controller";
import { createDailyQuestions } from "../controllers/question/dailyquestions.controller";
import {createStartUpQuestions} from "../controllers/question/startupquestions";
import { getAllStartUpQuestionsByCompanyIdAndUserId } from "../controllers/question/startupquestions";
import {createConversation,getConversationById,addUserToConversation,removeUserFromConversation,getConversationsForUser} from '../controllers/chat/chat';
import {createMessage,getMessagesByConversationId,markMessageAsRead, updateMessageStatus}  from '../controllers/message/message';
import {createInvitation,respondToInvitation,getInvitationsByUserId}  from '../controllers/invitation/invitation';
import { GetBlockUser, GetBlockedByUsers, blockUsers, unblockUsers } from "../controllers/chat/block";
import { de } from "@faker-js/faker";
import { createProject, getProjectsByDepartmentId, getProjectsforUser } from "../controllers/Project/project.controller";
import { ClearBoardAndAssociations, createboard, deleteBoardAndAssociations, getAllBoardsByCompanyId, getBoardTaskProgress } from "../controllers/Task_Management/Board.controller";
import { Create_Task, updateTaskBoardId } from "../controllers/Task_Management/task.controller";
import { CreateTaskChat, gettaskchat } from "../controllers/Task_Management/taskchat.controller";
import { Create_SubTask, updateSubTaskStatus } from "../controllers/Task_Management/subtask.controller";
import { getNotificationsByUserId, markAllNotificationsAsRead } from "../controllers/Notification/notification.controller";
import { createCategory, deleteCategory, getAllCategories, updateCategory } from "../controllers/gamifications/Category.controller";
import { createSubCategory, deleteSubCategory, getSubCategoryById, updateSubCategory } from "../controllers/gamifications/SubCategory.controller";
import { createGame, deleteGame, getGamesBySubCategory, updateGame } from "../controllers/gamifications/Game.controller";
import { createArticle, getUrlsByTitle } from "../controllers/Articles/Articles.controller";
import { createVideos, getVideoUrlsByTitle } from "../controllers/Articles/Video.controller";
import { createPodcast, getpodcastUrlsByTitle } from "../controllers/Articles/Podcasts.controller";
import { createWebinars, getWebinarsUrlsByTitle } from "../controllers/Articles/Webinars.controller";
import { createBooks, getBooksUrlsByTitle } from "../controllers/Articles/Books.controller";

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
router.post("/getCompanyAnnouncementforuser", getCompanyAnnouncementforuser);
router.post("/updateUserPointsAnnouncement", userController.updateUserPointsAnnouncement);
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

//Category routes
router.post('/createCategory',createCategory);
router.post('/getAllCategories',getAllCategories);
router.post('/updateCategory',updateCategory);
router.post('/deleteCategory',deleteCategory);
//Sub Category Routes
router.post('/createSubCategory',createSubCategory);
router.post('/getSubCategoryById',getSubCategoryById);
router.post('/deleteSubCategory',deleteSubCategory);
router.post('/updateSubCategory',updateSubCategory);
//Game Routes 
router.post('/createGame',createGame)
router.post('/getGamesBySubCategory',getGamesBySubCategory);
router.post('/updateGame',updateGame);
router.post('/deleteGame',deleteGame);
// function routes
router.post("/createFunction", functionController.createFunction);
router.post("/getCompanyFunctions", functionController.getCompanyFunctions);
router.post('/getCompanyFunctionsbyuserid',functionController.getCompanyFunctionsbyuserid);
router.post("/updateFunction", functionController.updateFunction);
router.delete("/deleteFunction", functionController.deleteFunction);

// department routes
router.post("/createDepartment", departmentController.createDepartment);
router.post("/getFunctionDepartments", departmentController.getFunctionDepartments);
router.post('/getDepartmentsyuserid',departmentController.getDepartmentsyuserid)
router.post("/updateDepartment", departmentController.updateDepartment);
router.delete("/deleteDepartment", departmentController.deleteDepartment);
router.post("/getDepartmentTeamsbyLead", teamController.getDepartmentLead);
router.post("/getallFunctionDepartments", departmentController.getFunctionDepartmentsall);
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
router.post('/updateMessageStatus',updateMessageStatus);
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

router.post("/saveAnswers",saveAnswers);
router.post("/getResponsesByUserId",getResponsesByUserId);
router.post('/getAnnouncementStats',getAnnouncementStats);


//Project 
router.post('/create-project',createProject);
router.post('/getProjectsByDepartmentId',getProjectsByDepartmentId);
router.post('/getProjectsforUser',getProjectsforUser);

//Board
router.post('/Board_Progress', getBoardTaskProgress);
router.post('/create-board',createboard);
router.post('/getAllBoardsByCompanyId',getAllBoardsByCompanyId);
router.post('/updateTaskBoard',updateTaskBoardId);

router.post('/deleteBoardAndAssociations',deleteBoardAndAssociations);

router.post('/ClearBoardAndAssociations',ClearBoardAndAssociations);

//CREATE TASK 
router.post('/create-task',Create_Task)
router.post('/task-chat',CreateTaskChat);
router.post('/gettaskchat',gettaskchat);

//Create Sub Task
router.post('/Create_SubTask',Create_SubTask);
router.post('/updateSubTaskStatus',updateSubTaskStatus);


//Notification
router.post('/getNotificationsByUserId',getNotificationsByUserId);
router.post('/markAllNotificationsAsRead',markAllNotificationsAsRead);



//ROLE BASE USER GET
router.post('/getdepartmentuser',userole.getTeamsWithUsers);

router.post('/getteamuser',userole.getTeamWithUsers);
router.post('/getTeamMembersbyteam',userole.getTeamMembers);


//Articles Routes
router.post('/createArticle',createArticle);
router.post('/getUrlsByTitle',getUrlsByTitle)
//Video Routes
router.post('/createVideos',createVideos);
router.post('/getVideoUrlsByTitle',getVideoUrlsByTitle);
//Podcast Routes
router.post('/createPosdcast',createPodcast);
router.post('/getpodcastUrlsByTitle',getpodcastUrlsByTitle);
//Webinars Routes
router.post('/createwebinars',createWebinars);
router.post('/getwebinarsUrlsByTitle',getWebinarsUrlsByTitle);
//Books Routes
router.post('/createBooks',createBooks);
router.post('/getBooksUrlsByTitle',getBooksUrlsByTitle);
module.exports = router;