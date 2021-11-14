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
const apollo_server_express_1 = require("apollo-server-express");
const apollo_server_core_1 = require("apollo-server-core");
const typeDefs_1 = __importDefault(require("../../graphql/typeDefs"));
const resolvers_1 = __importDefault(require("../../graphql/resolvers"));
function startApolloServer(httpServer) {
    return __awaiter(this, void 0, void 0, function* () {
        const server = new apollo_server_express_1.ApolloServer({
            typeDefs: typeDefs_1.default,
            resolvers: resolvers_1.default,
            plugins: [(0, apollo_server_core_1.ApolloServerPluginDrainHttpServer)({ httpServer })]
        });
        return server;
    });
}
exports.default = startApolloServer;
