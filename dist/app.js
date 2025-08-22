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
const express_1 = __importDefault(require("express"));
const global_errorhandler_middleware_1 = require("./Middlewares/global.errorhandler.middleware");
// import adminRouter from "./Modules/Admin/admin.router";
const index_routing_1 = __importDefault(require("./index.routing"));
const dotenv_1 = __importDefault(require("dotenv"));
const logger_middleware_1 = require("./Configs/logger.middleware");
dotenv_1.default.config();
const cors_1 = __importDefault(require("cors"));
exports.default = (app) => __awaiter(void 0, void 0, void 0, function* () {
    const corsOptions = {
        origin: '*',
    };
    app.use((0, cors_1.default)(corsOptions));
    app.use(logger_middleware_1.loggerMiddleware);
    app.use(express_1.default.json());
    app.use(express_1.default.urlencoded({ extended: true }));
    app.get('/', (req, res) => {
        return res.status(200).json({
            message: 'Server is running port 8080',
        });
    });
    app.use('/api', index_routing_1.default);
    app.use(global_errorhandler_middleware_1.globalErrorHandler);
    return app;
});
