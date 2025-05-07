import express from "express";

const router = express.Router();
import adminRouter from "./Modules/Admin/admin.router";
import companyRouter from "./Modules/Company/company.route";
router.use('/admin', adminRouter);
router.use('/company', companyRouter);
export default router;
