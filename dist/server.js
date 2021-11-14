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
const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
const connect_mongodb_session_1 = __importDefault(require("connect-mongodb-session"));
const http_1 = __importDefault(require("http"));
const startApolloServer_1 = __importDefault(require("./services/apollo/startApolloServer"));
const startAdminBro_1 = __importDefault(require("./services/adminBro/startAdminBro"));
const app = (0, express_1.default)();
const httpServer = http_1.default.createServer(app);
const connectMongo = (0, connect_mongodb_session_1.default)(express_session_1.default);
var store = new connectMongo({
    uri: "mongodb+srv://r2d2:3muCWbiTQe5gavkV@garcon-cluster0.0bjta.mongodb.net/garcon?retryWrites=true&w=majority",
    collection: "sessions"
});
app.use((0, express_session_1.default)({
    secret: "This is a secret",
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
    },
    store: store,
    resave: false,
    saveUninitialized: false
}));
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    const server = yield (0, startApolloServer_1.default)(httpServer);
    const [adminBro, router] = yield (0, startAdminBro_1.default)();
    app.use(adminBro.options.rootPath, router);
    yield server.start();
    server.applyMiddleware({ app });
    yield new Promise((resolve) => httpServer.listen({ port: 4000 }, resolve));
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
});
startServer();
