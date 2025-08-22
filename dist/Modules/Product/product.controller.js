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
const Response_1 = require("../../Utils/Response");
const product_service_1 = __importDefault(require("./product.service"));
const createProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield product_service_1.default.createNewProduct(req, res);
        return (0, Response_1.successResponse)(res, 200, 'Successfully Created New Product ', data);
    }
    catch (error) {
        console.log('Error in creating company', error);
        next(error);
    }
});
const fetchAllProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield product_service_1.default.getAllProducts(req, res);
        return (0, Response_1.successResponse)(res, 200, 'Successfully Fetched All Products ', data);
    }
    catch (error) {
        console.log('Error in creating company', error);
        next(error);
    }
});
const fetchProductDetails = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield product_service_1.default.getProduct(req, res);
        return (0, Response_1.successResponse)(res, 200, 'Successfully Fetched Product Details ', data);
    }
    catch (error) {
        console.log('Error in creating company', error);
        next(error);
    }
});
const updateProductDetails = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield product_service_1.default.editProduct(req, res);
        return (0, Response_1.successResponse)(res, 200, 'Successfully Edited Product Details ', data);
    }
    catch (error) {
        console.log('Error in creating company', error);
        next(error);
    }
});
const deleteProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield product_service_1.default.deleteProduct(req, res);
        return (0, Response_1.successResponse)(res, 200, 'Successfully Deleted Product Details ', data);
    }
    catch (error) {
        console.log('Error in creating company', error);
        next(error);
    }
});
exports.default = {
    createProduct,
    fetchAllProduct,
    fetchProductDetails,
    updateProductDetails,
    deleteProduct,
};
