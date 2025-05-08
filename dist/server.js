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
const app_1 = __importDefault(require("./app"));
const env_config_1 = require("./Configs/env.config");
const db_config_1 = require("./Configs/db.config");
const StartServer = () => __awaiter(void 0, void 0, void 0, function* () {
    let server;
    try {
        const app = (0, express_1.default)();
        yield (0, db_config_1.connectDB)();
        yield (0, app_1.default)(app);
        server = app.listen(env_config_1.PORT, () => {
            console.log(`Server is running at ${env_config_1.PORT}`);
        });
    }
    catch (error) {
        console.log("Error in starting server", error);
        process.exit();
    }
});
StartServer();
