"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const restaurantSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    menus: {
        type: [mongoose_1.Schema.Types.ObjectId],
        ref: "Menu",
        required: true
    }
});
const Restaurant = (0, mongoose_1.model)("Restaurant", restaurantSchema);
exports.default = Restaurant;
