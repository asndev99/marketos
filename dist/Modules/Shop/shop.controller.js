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
exports.getCompaniesByCategory = exports.companyProducts = exports.allCompanies = exports.categoryProducts = exports.discountedProducts = exports.popularCompanies = exports.getTopCategories = exports.updateProfilePicture = exports.getProfile = exports.completeShopDetails = void 0;
const shop_home_service_1 = __importDefault(require("./services/shop.home.service"));
const shop_profile_service_1 = __importDefault(require("./services/shop.profile.service"));
const Response_1 = require("../../Utils/Response");
const completeShopDetails = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield shop_profile_service_1.default.completeShopDetails(req);
        return (0, Response_1.successResponse)(res, 200, 'Shop Details Completed Successfully', null);
    }
    catch (error) {
        console.log('Error in creating shop', error);
        next(error);
    }
});
exports.completeShopDetails = completeShopDetails;
const getProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield shop_profile_service_1.default.getProfile(req);
        return (0, Response_1.successResponse)(res, 200, 'Profile Fetched Successfully', data);
    }
    catch (error) {
        console.log('Error in getting shop profile', error);
        next(error);
    }
});
exports.getProfile = getProfile;
const updateProfilePicture = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield shop_profile_service_1.default.updateProfilePicture(req);
        return (0, Response_1.successResponse)(res, 200, 'Shop Image Updated Successfully', data);
    }
    catch (error) {
        console.log('Error in updating profile Image', error);
        next(error);
    }
});
exports.updateProfilePicture = updateProfilePicture;
const getTopCategories = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield shop_home_service_1.default.getCategories(req);
        return (0, Response_1.successResponse)(res, 200, 'Top Categories Fetched Successfully', data);
    }
    catch (error) {
        console.log('Error in getting popular companies', error);
        next(error);
    }
});
exports.getTopCategories = getTopCategories;
const popularCompanies = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield shop_home_service_1.default.getPopularCompanies(req);
        return (0, Response_1.successResponse)(res, 200, 'Popular Companies Fetched Successully', data);
    }
    catch (error) {
        console.log('Error in getting popular companies');
        next(error);
    }
});
exports.popularCompanies = popularCompanies;
const discountedProducts = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield shop_home_service_1.default.getDiscountedProducts(req);
        return (0, Response_1.successResponse)(res, 200, 'Discounted Products Fetched Successfully', data);
    }
    catch (error) {
        console.log('Error in getting discounted Products');
        next(error);
    }
});
exports.discountedProducts = discountedProducts;
const categoryProducts = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield shop_home_service_1.default.getCategoryProducts(req);
        return (0, Response_1.successResponse)(res, 200, 'Category Products Fetched Successfully', data);
    }
    catch (error) {
        console.log('Error in getting discounted Products');
        next(error);
    }
});
exports.categoryProducts = categoryProducts;
const allCompanies = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield shop_home_service_1.default.getAllCompanies(req);
        return (0, Response_1.successResponse)(res, 200, 'All Companies Fetched Successully', data);
    }
    catch (error) {
        console.log('Error in getting popular companies');
        next(error);
    }
});
exports.allCompanies = allCompanies;
const companyProducts = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield shop_home_service_1.default.getCompanyProducts(req);
        return (0, Response_1.successResponse)(res, 200, 'Company Products Fetched Successfully', data);
    }
    catch (error) {
        console.log('Error in getting discounted Products');
        next(error);
    }
});
exports.companyProducts = companyProducts;
const getCompaniesByCategory = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield shop_home_service_1.default.getCompaniesByProducts(req);
        return (0, Response_1.successResponse)(res, 200, 'Companies by category fetched successfully', data);
    }
    catch (error) {
        console.log('Error in getting companies by category', error);
        next(error);
    }
});
exports.getCompaniesByCategory = getCompaniesByCategory;
exports.default = {
    completeShopDetails: exports.completeShopDetails,
    getProfile: exports.getProfile,
    updateProfilePicture: exports.updateProfilePicture,
    getTopCategories: exports.getTopCategories,
    popularCompanies: exports.popularCompanies,
    discountedProducts: exports.discountedProducts,
    allCompanies: exports.allCompanies,
    categoryProducts: exports.categoryProducts,
    companyProducts: exports.companyProducts,
    getCompaniesByCategory: exports.getCompaniesByCategory,
};
