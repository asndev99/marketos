"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cartRouter = express_1.default.Router();
const cart_controller_1 = __importDefault(require("./cart.controller"));
const auth_middleware_1 = require("../../Middlewares/auth.middleware");
const validateSchema_1 = require("../../Middlewares/validateSchema");
const addToCartSchema_1 = require("./validation/addToCartSchema");
const removeItemFromCartSchema_1 = require("./validation/removeItemFromCartSchema");
cartRouter.post('/', auth_middleware_1.verifyUser, (0, validateSchema_1.validateSchema)(addToCartSchema_1.addToCartSchema), cart_controller_1.default.addToCart);
cartRouter.get('/', auth_middleware_1.verifyUser, cart_controller_1.default.getMyCart);
cartRouter.patch('/', auth_middleware_1.verifyUser, (0, validateSchema_1.validateSchema)(removeItemFromCartSchema_1.removeItemFromCart), cart_controller_1.default.removeFromCart);
exports.default = cartRouter;
