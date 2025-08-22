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
const bcrypt_1 = __importDefault(require("bcrypt"));
const token_service_1 = __importDefault(require("./token.service"));
const constants_1 = require("../../Common/constants");
const Error_1 = require("../../Utils/Error");
const userRepository = new user_repository_1.MongoUserRepository();
const createAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    const hashPassword = yield bcrypt_1.default.hash(password, 10);
    return userRepository.create({
        username,
        password: hashPassword,
        role: constants_1.UserRole.ADMIN,
    });
});
const createCompany = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const existingCompany = yield userRepository.findByUsername(req.body.username);
    if (existingCompany) {
        throw new Error_1.BadRequestError('Company With This Username Is Already Registered');
    }
    const hashPassword = bcrypt_1.default.hashSync(req.body.password, 10);
    return userRepository.create(Object.assign(Object.assign({}, req.body), { password: hashPassword, role: 'COMPANY' }));
});
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password, role } = req.body;
    const user = yield userRepository.findOne({ username, role });
    if (!user) {
        throw new Error_1.BadRequestError('Invalid Credentials');
    }
    const isPassword = bcrypt_1.default.compareSync(password, user.password);
    if (!isPassword) {
        throw new Error_1.BadRequestError('Invalid Credenitals');
    }
    const accessToken = token_service_1.default.generateAccessToken({
        _id: user._id.toString(),
        role: user.role,
    });
    return { accessToken, isProfileCompleted: user.isProfileCompleted };
});
const createShop = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    const existingUsername = yield userRepository.findByUsername(username);
    if (existingUsername) {
        throw new Error_1.BadRequestError('This username is already in use');
    }
    const hashPassword = bcrypt_1.default.hashSync(password, 10);
    const shopKeeper = yield userRepository.create({ username, password: hashPassword, role: constants_1.UserRole.SHOPKEEPER });
    const accessToken = token_service_1.default.generateAccessToken({
        _id: shopKeeper._id.toString(),
        role: shopKeeper.role,
    });
    return { accessToken };
});
const validateUsername = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield userRepository.findByUsername(req.body.username);
    if (user) {
        throw new Error_1.BadRequestError('Username is already taken');
    }
    return;
});
exports.default = {
    createAdmin,
    createCompany,
    login,
    createShop,
    validateUsername,
};
