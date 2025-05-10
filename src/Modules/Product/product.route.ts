import { validateSchema } from "../../Middlewares/validateSchema";
import productController from "./product.controller";
import { verifyUser } from "../../Middlewares/auth.middleware";
import { authorizeRole } from "../../Middlewares/authorize.roles.middleware";
import { UserRole } from "../../Common/constants";
import handleMultipartData from "../../Middlewares/multer.middleware";

const productRouter = require("express").Router();

productRouter.post(
  "/add-product",
  verifyUser,
  handleMultipartData(["productImage"]),
  authorizeRole(UserRole.COMPANY),
  productController.createProduct
);
productRouter.get(
  "/get-product",
  verifyUser,
  authorizeRole(UserRole.COMPANY),
  productController.fetchAllProduct
);
productRouter.get(
  "/get-product/:id",
  verifyUser,
  authorizeRole(UserRole.COMPANY),
  productController.fetchProductDetails
);
productRouter.patch(
  "/edit-product/:id",
  verifyUser,
  handleMultipartData([]),
  authorizeRole(UserRole.COMPANY),
  productController.updateProductDetails
);
productRouter.delete(
  "/delete-product/:id",
  verifyUser,
  authorizeRole(UserRole.COMPANY),
  productController.deleteProduct
);
export default productRouter;
