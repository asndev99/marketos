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
const Error_1 = require("../../Utils/Error");
const product_repository_1 = require("./repository/product.repository");
const company_repository_1 = require("../Company/repository/company.repository");
const mongoose_1 = require("mongoose");
const helpers_1 = require("../../Utils/helpers");
const companyRepository = new company_repository_1.MongoCompanyRepository();
const productRepository = new product_repository_1.MongoProductRepository();
const createNewProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    let { price } = req.body;
    const userId = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a._id;
    const companyDetails = yield companyRepository.findOne({ userId });
    if (!companyDetails) {
        throw new Error_1.BadRequestError('Company Not Found');
    }
    const companyId = companyDetails === null || companyDetails === void 0 ? void 0 : companyDetails._id;
    const createdProduct = yield productRepository.create(Object.assign({ companyId }, req === null || req === void 0 ? void 0 : req.body));
    const images = req === null || req === void 0 ? void 0 : req.files['productImage'];
    const data = yield Promise.all(images.map((file) => __awaiter(void 0, void 0, void 0, function* () {
        const { url } = yield (0, helpers_1.uploadBufferToCloudinary)(file === null || file === void 0 ? void 0 : file.buffer, file.originalname, 'products');
        return { image: url, productId: createdProduct === null || createdProduct === void 0 ? void 0 : createdProduct._id };
    })));
    yield productRepository.createImage(data);
    return createdProduct === null || createdProduct === void 0 ? void 0 : createdProduct._id;
});
const getAllProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a._id;
    const companyDetails = yield companyRepository.findOne({ userId });
    if (!companyDetails) {
        throw new Error_1.BadRequestError('Company Not Found');
    }
    return yield productRepository.findAll({ companyId: companyDetails === null || companyDetails === void 0 ? void 0 : companyDetails.id });
});
const getProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a._id;
    const { id } = req === null || req === void 0 ? void 0 : req.params;
    if (!mongoose_1.Types.ObjectId.isValid(id)) {
        throw new Error_1.BadRequestError('Invalid product ID');
    }
    const companyDetails = yield companyRepository.findOne({ userId });
    if (!companyDetails) {
        throw new Error_1.BadRequestError('Company Not Found');
    }
    const data = yield productRepository.findOneProduct({ _id: id });
    if (!data)
        throw new Error_1.NotFoundError('Product not found !');
    return data;
});
const editProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    const userId = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a._id;
    const { id } = req === null || req === void 0 ? void 0 : req.params;
    if (!mongoose_1.Types.ObjectId.isValid(id)) {
        throw new Error_1.BadRequestError('Invalid product ID');
    }
    const companyDetails = yield companyRepository.findOne({ userId });
    if (!companyDetails) {
        throw new Error_1.BadRequestError('Company Not Found');
    }
    const data = yield productRepository.findOneProduct({ _id: id });
    if (!data)
        throw new Error_1.NotFoundError('Product not found !');
    if (Array.isArray((_b = req.body) === null || _b === void 0 ? void 0 : _b.imageIDs)) {
        const ids = req.body.imageIDs.map((id) => ({
            _id: new mongoose_1.Types.ObjectId(id),
        }));
        yield productRepository.deleteProductImages(ids);
    }
    const uploadedImages = (_c = req.files) === null || _c === void 0 ? void 0 : _c['productImage'];
    if (Array.isArray(uploadedImages) && uploadedImages.length > 0) {
        const imageData = yield Promise.all(uploadedImages.map((file) => __awaiter(void 0, void 0, void 0, function* () {
            const { url } = yield (0, helpers_1.uploadBufferToCloudinary)(file.buffer, file.originalname, 'products');
            return {
                image: url,
                productId: new mongoose_1.Types.ObjectId(id),
            };
        })));
        yield productRepository.createImage(imageData);
    }
    let discountedPrice = (_d = req.body) === null || _d === void 0 ? void 0 : _d.discountedPrice;
    if (discountedPrice === 'null' || discountedPrice === null) {
        discountedPrice = null;
    }
    const updateData = Object.assign(Object.assign({}, req.body), { discountedPrice });
    // Remove unnecessary fields
    delete updateData.imageIDs;
    yield productRepository.updateProduct(new mongoose_1.Types.ObjectId(id), updateData);
    return true;
});
const deleteProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    return yield productRepository.deleteProduct(new mongoose_1.Types.ObjectId(id));
});
exports.default = {
    createNewProduct,
    getAllProducts,
    getProduct,
    editProduct,
    deleteProduct,
};
