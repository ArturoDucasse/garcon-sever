"use strict";
exports.__esModule = true;
var mongoose_1 = require("mongoose");
var mongoConnection = function () {
    return (0, mongoose_1.connect)("mongodb+srv://r2d2:3muCWbiTQe5gavkV@garcon-cluster0.0bjta.mongodb.net/garcon?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true });
};
exports["default"] = mongoConnection;
