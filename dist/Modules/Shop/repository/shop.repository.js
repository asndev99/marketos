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
exports.ShopRepository = void 0;
const shop_model_1 = require("../shop.model");
class ShopRepository {
    createProfile(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return shop_model_1.ShopModel.create(data);
        });
    }
    findOne(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return shop_model_1.ShopModel.findOne(data);
        });
    }
    findOneAndUpdate(where, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return shop_model_1.ShopModel.findOneAndUpdate(where, data, { new: true });
        });
    }
}
exports.ShopRepository = ShopRepository;
