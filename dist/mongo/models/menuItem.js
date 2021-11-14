"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const menuItemSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    menuId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: "Menu"
    }
});
const MenuItem = (0, mongoose_1.model)("MenuItem", menuItemSchema);
exports.default = MenuItem;
