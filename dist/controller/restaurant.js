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
const menu_1 = __importDefault(require("../mongo/models/menu"));
const menuItem_1 = __importDefault(require("../mongo/models/menuItem"));
const restaurant_1 = __importDefault(require("../mongo/models/restaurant"));
exports.default = (req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = req.params;
        req.session.data = data;
        const restaurant = yield restaurant_1.default.findById(data.restaurantId).populate({
            path: "menus",
            model: menu_1.default,
            populate: { path: "menuItems", model: menuItem_1.default }
        });
        if (!restaurant)
            throw new Error("Restaurant not found");
        res.json(restaurant).status(200);
    }
    catch (error) {
        res.status(404).json({ success: false, error: error.message });
        // next(error); Create error handler
    }
});
