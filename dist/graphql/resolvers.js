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
const restaurant_1 = __importDefault(require("../mongo/models/restaurant"));
const resolvers = {
    Query: {
        getRestaurant(_parent, { id }, context, _info) {
            return __awaiter(this, void 0, void 0, function* () {
                context.session.user = context.query;
                const restaurant = yield restaurant_1.default.findById(id).populate({
                    path: "menus",
                    populate: { path: "menuItems" }
                });
                return restaurant;
            });
        },
        test(_parent, _args, context) {
            // console.log(context.session, "context");
            context.session.test = "testing";
            return context.session.test + " " + "success";
        },
        test2(p, a, context) {
            return context.session.test;
        }
    },
    Mutation: {
        createOrder(parent, { ordersArray }, context, info) {
            // context.session.user.orders = ordersArray;
            return "Success";
        }
    }
};
exports.default = resolvers;
