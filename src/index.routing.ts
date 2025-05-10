import express from "express";

const router = express.Router();
import adminRouter from "./Modules/Admin/admin.router";
import companyRouter from "./Modules/Company/company.route";
import productRouter from "./Modules/Product/product.route";
router.use('/admin', adminRouter);
router.use('/company', companyRouter);
router.use("/product", productRouter);
export default router;
