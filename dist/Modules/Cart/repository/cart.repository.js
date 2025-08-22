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
exports.MongoCartRepository = void 0;
const cart_model_1 = require("../cart.model");
class MongoCartRepository {
    create(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return cart_model_1.CartModel.create(payload);
        });
    }
    addToCart(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { productId, userId, shopId } = payload;
            const existingItem = yield this.findOne({ shopId, productId, userId });
            if (existingItem) {
                const updated = yield this.findOneAndUpdate({ _id: existingItem._id }, { qty: existingItem.qty + 1 });
                if (!updated) {
                    throw new Error('Failed to update cart item');
                }
                return updated;
            }
            return this.create({ userId, productId, shopId, qty: 1 });
        });
    }
    findOne(payload_1) {
        return __awaiter(this, arguments, void 0, function* (payload, exclude = {}, populate) {
            let query = cart_model_1.CartModel.findOne(payload).select(exclude);
            if (populate) {
                query = query.populate(populate);
            }
            return query;
        });
    }
    /**
     * Finds multiple Cart documents based on the provided filter query.
     *
     * @param {FilterQuery<ICartDocument>} payload - MongoDB query object to filter documents.
     * @param {Record<string, 0 | 1>} [exclude={}] - Fields to exclude (0) or include (1) from the result set.
     * @param {string | string[] | PopulateOptions | PopulateOptions[]} [populate] - Fields or references to populate.
     *
     * @returns {Promise<ICartDocument[]>} - A promise that resolves to an array of cart documents.
     *
     * @example
     * // Example 1: Simple find with field exclusion
     * await findMany({ userId: "123" }, { __v: 0 });
     *
     * @example
     * // Example 2: With populate string
     * await findMany({ userId: "123" }, {}, "product");
     *
     * @example
     * // Example 3: With populate options
     * await findMany({ userId: "123" }, {}, { path: "product", select: "title price" });
     *
     * @example
     * // Example 4: With multiple populate fields
     * await findMany({ userId: "123" }, {}, [
     *   { path: "product", select: "title" },
     *   { path: "user", select: "name email" }
     * ]);
     */
    // Mongoose populate() Method Accepts Multiple Types
    findMany(payload_1) {
        return __awaiter(this, arguments, void 0, function* (payload, exclude = {}, populate) {
            let query = cart_model_1.CartModel.find(payload).select(exclude);
            if (populate) {
                query = query.populate(populate);
            }
            return query;
        });
    }
    findOneAndDelete(options) {
        return __awaiter(this, void 0, void 0, function* () {
            return cart_model_1.CartModel.findOneAndDelete(options);
        });
    }
    findOneAndUpdate(whereOptions, updateOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            return cart_model_1.CartModel.findOneAndUpdate(whereOptions, updateOptions, { new: true });
        });
    }
    RemoveItemFromCart(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingItem = yield this.findOne({
                _id: options.cartId,
                productId: options.productId,
                shopId: options.shopId,
            });
            if (!existingItem)
                return null;
            const newQty = existingItem.qty - 1;
            if (newQty <= 0) {
                return this.findOneAndDelete({ _id: existingItem._id });
            }
            else {
                return this.findOneAndUpdate({ _id: existingItem._id }, { qty: newQty });
            }
        });
    }
    RemoveProductFromCart(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingItem = yield this.findOne({
                productId: options.productId,
                userId: options.userId,
            });
            if (!existingItem)
                return null;
            else
                return this.findOneAndDelete({ _id: existingItem._id });
        });
    }
}
exports.MongoCartRepository = MongoCartRepository;
