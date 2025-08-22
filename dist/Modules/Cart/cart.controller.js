"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cart_service_1 = __importDefault(require("./cart.service"));
const Response_1 = require("../../Utils/Response");
//for SHOP RIGHT NOW
const addToCart = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield cart_service_1.default.addToCart(req);
        return (0, Response_1.successResponse)(res, 200, 'Item Added To Cart Successfully', null);
    }
    catch (error) {
        console.log('Error in add to cart', error);
        next(error);
    }
});
const getMyCart = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield cart_service_1.default.getCartItems(req);
        return (0, Response_1.successResponse)(res, 200, 'Cart Items Fetched Successfully', data);
    }
    catch (error) {
        console.log('Error in getting my cart', error);
        next(error);
    }
});
const removeFromCart = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield cart_service_1.default.removeFromCart(req);
        return (0, Response_1.successResponse)(res, 200, 'Cart Removed From Cart Successfully', null);
    }
    catch (error) {
        console.log('Error in removing from cart');
        next(error);
    }
});
exports.default = {
    addToCart,
    getMyCart,
    removeFromCart,
};
