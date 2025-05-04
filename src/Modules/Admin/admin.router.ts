import { validateSchema } from "../../Middlewares/validateSchema";
import { createCompanySchema } from "./validation/createCompanySchema";
import adminController from "./admin.controller";
import { createAdminSchema } from "./validation/createAdminSchema";
import { verifyUser } from "../../Middlewares/auth.middleware";
import { authorizeRole } from "../../Middlewares/authorize.roles.middleware";
import { UserRole } from "../../Common/constants";
import { loginAdminSchema } from "./validation/loginAdminSchema";

const adminRouter = require("express").Router();

adminRouter.post(
  "/create-admin",
  validateSchema(createAdminSchema),
  adminController.createAdmin
);

adminRouter.post(
  "/login",
  validateSchema(loginAdminSchema),
  adminController.loginAdmin
);

adminRouter.post(
  "/create-company",
  verifyUser,
  authorizeRole(UserRole.ADMIN),
  validateSchema(createCompanySchema),
  adminController.createCompany
);

export default adminRouter;
