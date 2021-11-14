"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const menuSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true
    },
    menuItems: {
        type: [mongoose_1.Schema.Types.ObjectId],
        ref: "MenuItem",
        required: true
    },
    restaurantId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Restaurant",
        required: true
    }
});
const Menu = (0, mongoose_1.model)("Menu", menuSchema);
exports.default = Menu;
