import express from "express";
import * as userController from "../controllers/user/user.controller";
import { createCompanyValidator } from "../controllers/company/company.validator";
import validate from "express-validation";
import {
  getAllUsers,
  createCompany,
  deleteCompany,
  getCompanies,
  getCompanyById,
  updateCompany,
} from "../controllers/company/company.controller";

const router = express.Router();

//= ===============================
// Super Admin routes
//= ===============================
router.get("/allUsers", userController.allUsers);
router.get("/allCompanies", getCompanies);
router.post("/company", getCompanyById);
router.delete("/deleteCompany", deleteCompany);
router.post("/updateCompany", updateCompany);
router.post("/createCompany", validate(createCompanyValidator), createCompany);
router.get("/getAllUsers", getAllUsers);
router.post("/getAllUserByCompanyId", userController.getAllUserByCompanyId);
router.post("/updateUser", userController.updateUser);

module.exports = router;
