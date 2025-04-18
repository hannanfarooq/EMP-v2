import express from "express";
import dotenv from "dotenv";

import bodyParser from "body-parser";
import cors from "cors";

import publicRoutes from "./src/routes/public";
import apiRoutes from "./src/routes/api";
import adminRoutes from "./src/routes/admin";
import companyAdminRoute from "./src/routes/companyAdmin";

import apiMiddleware from "./src/middleware/apiAuth";
import adminMiddleware from "./src/middleware/adminAuth";
import errorHandler from "./src/middleware/errorHandler";
import superAdminAuth from "./src/middleware/superAdminAuth";
import adminAuth from "./src/middleware/adminAuth";

dotenv.config();
require("./src/config/sequelize");

const app = express();
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
//app.use(express.json());

app.use(cors());
app.use(bodyParser.json());
app.use("/pub", publicRoutes);
app.use("/api", apiMiddleware, apiRoutes);
app.use("/api/admin", superAdminAuth, adminRoutes);
app.use("/api/companyAdmin", adminAuth, companyAdminRoute);
app.use(errorHandler);

module.exports = app;
