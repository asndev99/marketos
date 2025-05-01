import { validateSchema } from "../../Middlewares/validateSchema";
import { createCompanySchema } from "./validation/createCompanySchema";
import adminController from "./admin.controller";

const adminRouter = require("express").Router();

adminRouter.post(
  "/create-company",

  validateSchema(createCompanySchema),
  adminController.createCompany
);

module.exports = adminRouter;
