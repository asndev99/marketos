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
exports.MongoProductRepository = void 0;
const product_model_1 = require("../product.model");
const productImage_model_1 = require("../productImage.model");
class MongoProductRepository {
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return product_model_1.ProductModel.create(data);
        });
    }
    findOne(payload_1) {
        return __awaiter(this, arguments, void 0, function* (payload, exclude = {}) {
            return product_model_1.ProductModel.findOne(payload).select(exclude);
        });
    }
    createImage(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return productImage_model_1.ProductImageModel.insertMany(data);
        });
    }
    findAll(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return product_model_1.ProductModel.find(Object.assign({ isDeleted: false }, payload))
                .populate('images')
                .exec();
        });
    }
    findOneProduct(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return product_model_1.ProductModel.findOne(Object.assign({ isDeleted: false }, payload))
                .populate('images')
                .exec();
        });
    }
    deleteProductImages(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const ids = payload.map((p) => p._id);
            return yield productImage_model_1.ProductImageModel.deleteMany({ _id: { $in: ids } });
        });
    }
    updateProduct(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield product_model_1.ProductModel.updateOne({ _id: id }, { $set: data });
        });
    }
    deleteProduct(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield product_model_1.ProductModel.updateOne({ _id: id }, { $set: { isDeleted: true } });
            yield productImage_model_1.ProductImageModel.updateMany({ productId: id }, { $set: { isDelete: true } });
            return true;
        });
    }
    FindMany(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { filter = {}, sortBy = 'createdAt', sortOrder = 'desc', limit = 10, page = 1, } = payload;
            const skip = (page - 1) * limit;
            const sort = {
                [sortBy]: sortOrder === 'asc' ? 1 : -1,
            };
            const [products, count] = yield Promise.all([
                product_model_1.ProductModel.find(filter).populate({ path: "images" }).skip(skip).sort(sort).lean(),
                product_model_1.ProductModel.countDocuments(filter),
            ]);
            return {
                data: products,
                meta: {
                    limit,
                    page,
                    total: count,
                    totalPages: Math.ceil(count / limit),
                },
            };
        });
    }
}
exports.MongoProductRepository = MongoProductRepository;
