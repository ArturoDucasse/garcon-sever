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
const admin_bro_1 = __importDefault(require("admin-bro"));
const mongoose_1 = __importDefault(require("@admin-bro/mongoose"));
const connection_1 = __importDefault(require("../../mongo/connection"));
const express_1 = __importDefault(require("@admin-bro/express"));
admin_bro_1.default.registerAdapter(mongoose_1.default);
const startAdmin = () => __awaiter(void 0, void 0, void 0, function* () {
    const db = yield (0, connection_1.default)();
    const adminBro = new admin_bro_1.default({
        databases: [db],
        resources: [],
        rootPath: "/admin"
    });
    const router = express_1.default.buildRouter(adminBro);
    return [adminBro, router];
});
exports.default = startAdmin;
