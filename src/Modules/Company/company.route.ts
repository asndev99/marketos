import { validateSchema } from "../../Middlewares/validateSchema";
import companyController from "./company.controller";
import { verifyUser } from "../../Middlewares/auth.middleware";
import { authorizeRole } from "../../Middlewares/authorize.roles.middleware";
import { UserRole } from "../../Common/constants";
import { loginAdminSchema } from "../Admin/validation/loginAdminSchema";

const companyRouter = require("express").Router();

companyRouter.post(
    "/login",
    validateSchema(loginAdminSchema),
    companyController.loginCompany
)

companyRouter.post(
    "/create-profile",
    verifyUser,
    authorizeRole(UserRole.COMPANY),
    // Need to add multer middleware
    companyController.createProfile
)

export default companyRouter;