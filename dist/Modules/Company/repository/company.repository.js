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
exports.MongoCompanyRepository = void 0;
const company_model_1 = require("../company.model");
class MongoCompanyRepository {
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return company_model_1.CompanyModel.create(data);
        });
    }
    update(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return company_model_1.CompanyModel.findByIdAndUpdate(id, Object.assign({}, data));
        });
    }
    findOne(payload_1) {
        return __awaiter(this, arguments, void 0, function* (payload, exclude = {}) {
            return company_model_1.CompanyModel.findOne(payload).select(exclude);
        });
    }
    findMany(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { filter = {}, page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc', } = payload;
            const skip = (page - 1) * limit;
            const sort = {
                [sortBy]: sortOrder === 'asc' ? 1 : -1,
            };
            const [data, total] = yield Promise.all([
                company_model_1.CompanyModel.find(filter).skip(skip).limit(limit).sort(sort),
                company_model_1.CompanyModel.countDocuments(filter),
            ]);
            return {
                data,
                meta: {
                    total,
                    page,
                    limit,
                    totalPages: Math.ceil(total / limit),
                },
            };
        });
    }
}
exports.MongoCompanyRepository = MongoCompanyRepository;
