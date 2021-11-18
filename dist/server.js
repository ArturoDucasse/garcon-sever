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
const http_1 = __importDefault(require("http"));
const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
const connect_mongo_1 = __importDefault(require("connect-mongo"));
const subscriptions_transport_ws_1 = require("subscriptions-transport-ws");
const graphql_1 = require("graphql");
const connection_1 = __importDefault(require("./mongo/connection"));
const startApolloServer_1 = __importDefault(require("./services/apollo/startApolloServer"));
const startAdminBro_1 = __importDefault(require("./services/adminBro/startAdminBro"));
const restaurant_1 = __importDefault(require("./mongo/models/restaurant"));
const menu_1 = __importDefault(require("./mongo/models/menu"));
const menuItem_1 = __importDefault(require("./mongo/models/menuItem"));
const app = (0, express_1.default)();
const httpServer = http_1.default.createServer(app);
app.use((0, express_session_1.default)({
    secret: "foo",
    resave: false,
    saveUninitialized: false,
    store: connect_mongo_1.default.create({
        mongoUrl: "mongodb+srv://r2d2:3muCWbiTQe5gavkV@garcon-cluster0.0bjta.mongodb.net/garcon?retryWrites=true&w=majority",
        dbName: "garcon",
        collectionName: "sessions",
        stringify: false
    })
}));
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    const [apollo, schema] = yield (0, startApolloServer_1.default)(httpServer);
    const [adminBro, router] = yield (0, startAdminBro_1.default)();
    yield (0, connection_1.default)();
    app.use(adminBro.options.rootPath, router);
    app.get("/:restaurantId/:tableId", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
    }));
    yield apollo.start();
    apollo.applyMiddleware({ app });
    subscriptions_transport_ws_1.SubscriptionServer.create({ schema, execute: graphql_1.execute, subscribe: graphql_1.subscribe }, { server: httpServer, path: apollo.graphqlPath });
    yield new Promise((resolve) => httpServer.listen({ port: 3000 }, resolve));
    console.log(`🚀 Server ready at http://localhost:3000${apollo.graphqlPath}`);
    console.log(`🚀 Admin view ready at http://localhost:3000/admin`);
});
startServer();
