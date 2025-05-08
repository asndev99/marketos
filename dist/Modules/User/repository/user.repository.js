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
exports.MongoUserRepository = void 0;
const user_model_1 = require("../user.model");
class MongoUserRepository {
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return user_model_1.UserModel.create(data);
        });
    }
    findByUsername(username) {
        return __awaiter(this, void 0, void 0, function* () {
            return user_model_1.UserModel.findOne({ username });
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return user_model_1.UserModel.findById(id);
        });
    }
    findOne(payload_1) {
        return __awaiter(this, arguments, void 0, function* (payload, exclude = {}) {
            return user_model_1.UserModel.findOne(payload).select(exclude);
        });
    }
}
exports.MongoUserRepository = MongoUserRepository;
