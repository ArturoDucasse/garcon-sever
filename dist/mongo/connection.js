"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const mongoConnection = () => {
    return (0, mongoose_1.connect)("mongodb+srv://r2d2:3muCWbiTQe5gavkV@garcon-cluster0.0bjta.mongodb.net/garcon?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true });
};
exports.default = mongoConnection;
