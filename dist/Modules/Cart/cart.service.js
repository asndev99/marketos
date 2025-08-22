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
Object.defineProperty(exports, "__esModule", { value: true });
const cart_repository_1 = require("./repository/cart.repository");
const product_repository_1 = require("../Product/repository/product.repository");
const dto_1 = require("./dto");
const cartRepository = new cart_repository_1.MongoCartRepository();
const productRepository = new product_repository_1.MongoProductRepository();
const addToCart = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const { shopId, productId } = req.body;
    return cartRepository.addToCart({ shopId, productId, userId: req.user._id.toString() });
});
const getCartItems = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield cartRepository.findMany({ userId: req.user._id.toString() }, {}, [
        {
            path: 'productId',
            select: 'name price discountedPrice status',
            populate: {
                path: 'images',
                select: 'image',
            },
        },
    ]);
    return (0, dto_1.getCartItemsDto)(data);
});
const removeFromCart = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const { productId, shopId, cartId } = req.body;
    return yield cartRepository.RemoveItemFromCart({ productId, shopId, cartId });
});
exports.default = {
    addToCart,
    getCartItems,
    removeFromCart,
};
