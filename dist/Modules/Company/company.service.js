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
const user_repository_1 = require("../User/repository/user.repository");
const token_service_1 = __importDefault(require("../Auth/token.service"));
const Error_1 = require("../../Utils/Error");
const bcrypt_1 = __importDefault(require("bcrypt"));
const company_repository_1 = require("./repository/company.repository");
const companyRepository = new company_repository_1.MongoCompanyRepository();
const userRepository = new user_repository_1.MongoUserRepository();
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    const company = yield userRepository.findOne({ username, role: "COMPANY" });
    if (!company) {
        throw new Error_1.BadRequestError("Invalid Credentials");
    }
    const isPassword = bcrypt_1.default.compareSync(password, company.password);
    if (!isPassword) {
        throw new Error_1.BadRequestError("Invalid Credenitals");
    }
    const accessToken = token_service_1.default.generateAccessToken({
        _id: company === null || company === void 0 ? void 0 : company._id.toString(),
        role: company.role
    });
    return { accessToken };
});
const createCompanyDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    let { companyName, establishedDate, websiteLink, category, city, state, address, warehouseAddress, saleTaxNum, NTN, contactPersonName, contactNumber, contactEmail, alternativeNumber, numOfDistribution } = req.body;
    const userId = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a._id;
    numOfDistribution = Number(numOfDistribution);
    return companyRepository.create(Object.assign({ userId }, req.body));
});
exports.default = {
    login,
    createCompanyDetails,
};
