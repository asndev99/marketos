"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const validateSchema_1 = require("../../Middlewares/validateSchema");
const shop_controller_1 = __importDefault(require("./shop.controller"));
const createShopProfileSchema_1 = require("./validation/createShopProfileSchema");
const auth_middleware_1 = require("../../Middlewares/auth.middleware");
const authorize_roles_middleware_1 = require("../../Middlewares/authorize.roles.middleware");
const constants_1 = require("../../Common/constants");
const multer_middleware_1 = require("../../Middlewares/formData/multer.middleware");
const shopRouter = express_1.default.Router();
shopRouter.post('/complete-profile', auth_middleware_1.verifyUser, (0, authorize_roles_middleware_1.authorizeRole)(constants_1.UserRole.SHOPKEEPER), (0, validateSchema_1.validateSchema)(createShopProfileSchema_1.createShopProfileSchema), shop_controller_1.default.completeShopDetails);
shopRouter.get('/profile', auth_middleware_1.verifyUser, (0, authorize_roles_middleware_1.authorizeRole)(constants_1.UserRole.SHOPKEEPER), shop_controller_1.default.getProfile);
shopRouter.patch('/image', auth_middleware_1.verifyUser, (0, authorize_roles_middleware_1.authorizeRole)(constants_1.UserRole.SHOPKEEPER), (0, multer_middleware_1.createUploadMiddleware)([
    {
        name: 'shopImage',
        maxCount: 1,
        required: false,
    },
]), shop_controller_1.default.updateProfilePicture);
shopRouter.get('/top-categories', auth_middleware_1.verifyUser, (0, authorize_roles_middleware_1.authorizeRole)(constants_1.UserRole.SHOPKEEPER), shop_controller_1.default.getTopCategories);
shopRouter.get('/popular-companies', auth_middleware_1.verifyUser, (0, authorize_roles_middleware_1.authorizeRole)(constants_1.UserRole.SHOPKEEPER), shop_controller_1.default.popularCompanies);
shopRouter.get('/discounted-products', auth_middleware_1.verifyUser, (0, authorize_roles_middleware_1.authorizeRole)(constants_1.UserRole.SHOPKEEPER), shop_controller_1.default.discountedProducts);
shopRouter.get('/all-companies', auth_middleware_1.verifyUser, (0, authorize_roles_middleware_1.authorizeRole)(constants_1.UserRole.SHOPKEEPER), shop_controller_1.default.allCompanies);
shopRouter.get('/category-products', auth_middleware_1.verifyUser, (0, authorize_roles_middleware_1.authorizeRole)(constants_1.UserRole.SHOPKEEPER), shop_controller_1.default.categoryProducts);
shopRouter.get('/company-products/:id', auth_middleware_1.verifyUser, (0, authorize_roles_middleware_1.authorizeRole)(constants_1.UserRole.SHOPKEEPER), shop_controller_1.default.companyProducts);
shopRouter.get('/companies-by-category', auth_middleware_1.verifyUser, (0, authorize_roles_middleware_1.authorizeRole)(constants_1.UserRole.SHOPKEEPER), shop_controller_1.default.getCompaniesByCategory);
exports.default = shopRouter;
