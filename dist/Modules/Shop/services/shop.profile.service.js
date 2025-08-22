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
const shop_repository_1 = require("../repository/shop.repository");
const Error_1 = require("../../../Utils/Error");
const user_repository_1 = require("../../User/repository/user.repository");
const helpers_1 = require("../../../Utils/helpers");
const shopRepository = new shop_repository_1.ShopRepository();
const userRepository = new user_repository_1.MongoUserRepository();
const completeShopDetails = (req) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    if (req.user.isProfileCompleted) {
        throw new Error_1.BadRequestError("Your Shop Details Are Completed");
    }
    const createShopPayload = req.body;
    const isPhoneNicExists = yield shopRepository.findOne({
        $or: [{ mobileNumber: createShopPayload.mobileNumber }, { NIC: createShopPayload.NIC }],
    });
    if (isPhoneNicExists) {
        throw new Error_1.BadRequestError('Shop with this phone or CNIC already exists');
    }
    const latitude = parseFloat(createShopPayload.latitude.toString());
    const longitude = parseFloat(createShopPayload.longitude.toString());
    yield shopRepository.createProfile(Object.assign(Object.assign({}, createShopPayload), { ntn: (_a = createShopPayload.ntn) !== null && _a !== void 0 ? _a : undefined, userId: (_b = req.user) === null || _b === void 0 ? void 0 : _b._id, location: {
            type: 'Point',
            coordinates: [longitude, latitude],
        } })),
        yield userRepository.findByIdAndUpdate(req.user._id.toString(), { isProfileCompleted: true });
    return;
});
const updateProfilePicture = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const files = req.files;
    if (!files || !files['shopImage'] || files['shopImage'].length === 0) {
        return yield shopRepository.findOneAndUpdate({ userId: req.user._id }, { shopImage: null });
    }
    const file = files['shopImage'][0];
    const { url: logo } = yield (0, helpers_1.uploadBufferToCloudinary)(file.buffer, file.originalname, 'shop');
    return yield shopRepository.findOneAndUpdate({ userId: req.user._id }, { shopImage: logo });
});
const getProfile = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield shopRepository.findOne({ userId: req.user._id });
    if (!data)
        throw new Error_1.NotFoundError('Shop Not Found');
    return data;
});
exports.default = {
    getProfile,
    completeShopDetails,
    updateProfilePicture
};
