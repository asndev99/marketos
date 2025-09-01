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
const constants_1 = require("../../../Common/constants");
const company_repository_1 = require("../../Company/repository/company.repository");
const product_repository_1 = require("../../Product/repository/product.repository");
const dto_1 = require("../../Product/dto");
const companyRepository = new company_repository_1.MongoCompanyRepository();
const productRepository = new product_repository_1.MongoProductRepository();
const getCategories = (req) => __awaiter(void 0, void 0, void 0, function* () {
    return Object.keys(constants_1.categoryMap).map((item) => ({
        key: item,
        value: constants_1.categoryMap[item],
    }));
});
const getPopularCompanies = (req) => __awaiter(void 0, void 0, void 0, function* () {
    return companyRepository.findMany({
        filter: {
            isPopular: true,
        },
        page: req.query.page ? parseInt(req.query.page, 10) : undefined,
        limit: req.query.limit ? parseInt(req.query.limit, 10) : undefined,
        sortBy: 'popularityRate',
        sortOrder: 'desc',
    });
});
const getDiscountedProducts = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const { data, meta } = yield productRepository.FindMany({
        filter: {
            status: 'DISCOUNTED',
            isDeleted: false,
        },
        page: req.query.page ? parseInt(req.query.page, 10) : undefined,
        limit: req.query.limit ? parseInt(req.query.limit, 10) : undefined,
        sortOrder: 'desc',
    });
    const result = (0, dto_1.discountedProductsDto)(data);
    return {
        data: result,
        meta,
    };
});
const getAllCompanies = (req) => __awaiter(void 0, void 0, void 0, function* () {
    return companyRepository.findMany({
        page: req.query.page ? parseInt(req.query.page, 10) : undefined,
        limit: req.query.limit ? parseInt(req.query.limit, 10) : undefined,
        sortBy: 'popularityRate',
        sortOrder: 'desc',
    });
});
const getCategoryProducts = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const { data, meta } = yield productRepository.FindMany({
        filter: {
            category: constants_1.categoryMap[req.query.category],
            isDeleted: false,
            stockQuantity: {
                $gt: 0,
            },
        },
        page: req.query.page ? parseInt(req.query.page, 10) : undefined,
        limit: req.query.limit ? parseInt(req.query.limit, 10) : undefined,
        sortOrder: 'desc',
    });
    const result = (0, dto_1.discountedProductsDto)(data);
    return {
        data: result,
        meta,
    };
});
const getCompanyProducts = (req) => __awaiter(void 0, void 0, void 0, function* () {
    let filter = {
        companyId: req.params.id.toString(),
        isDeleted: false,
    };
    if (req.query.categoryName && constants_1.categoryMap[req.query.categoryName]) {
        filter.category = constants_1.categoryMap[req.query.categoryName];
    }
    const { data, meta } = yield productRepository.FindMany({
        filter: {
            companyId: req.params.id.toString(),
            isDeleted: false,
        },
        page: req.query.page ? parseInt(req.query.page, 10) : undefined,
        limit: req.query.limit ? parseInt(req.query.limit, 10) : undefined,
        sortOrder: 'desc',
    });
    const result = (0, dto_1.discountedProductsDto)(data);
    return {
        data: result,
        meta,
    };
});
const getCompaniesByProducts = (req) => __awaiter(void 0, void 0, void 0, function* () {
    return companyRepository.findMany({
        filter: { category: req.query.category },
    });
});
exports.default = {
    getCategories,
    getPopularCompanies,
    getDiscountedProducts,
    getAllCompanies,
    getCategoryProducts,
    getCompanyProducts,
    getCompaniesByProducts,
};
