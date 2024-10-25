import express from "express";
import validate from "express-validation";

import * as userController from "../controllers/user/user.controller";
import * as userValidator from "../controllers/user/user.validator";
import {
  createCompanyThread,
  getAllCompanyThreads,
} from "../controllers/companyThread/companyThread.controller";
import { createThreadMessage } from "../controllers/threadMessage/threadMessage.controller";
import { fetchArticles } from "../controllers/buyAndSell/buyAnsSell.controller";

const router = express.Router();

//= ===============================
// Public routes
//= ===============================

router.post(
  "/sendEmail",

  userController.sendEmail
);
router.post("/login", validate(userValidator.login), userController.login);

router.post("/forgotPassword", userController.forgetPassword);
router.post('/verifyOTP',userController.verifyToken)

router.post('/resetPassword',userController.resetPassword)

router.post(
  "/register",
  validate(userValidator.register),
  userController.register
);
router.post(
  "/createComment",
  // validate(userValidator.register),
  createCompanyThread
);
router.post(
  "/createReply",
  // validate(userValidator.register),
  createThreadMessage
);

router.get("/getAllThreadMessage/:companyId", getAllCompanyThreads);

router.get('/articles', fetchArticles);

module.exports = router;
