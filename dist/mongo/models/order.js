"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const orderSchema = new mongoose_1.Schema({
    orderItems: {
        type: [mongoose_1.Schema.Types.ObjectId],
        ref: "MenuItem",
        required: true
    },
    totalAmount: {
        type: Number,
        required: true
    },
    restaurantId: {
        type: Number,
        required: true
    },
    tableId: {
        type: Number,
        required: true
    }
}, { timestamps: true });
const Order = (0, mongoose_1.model)("Order", orderSchema);
exports.default = Order;
