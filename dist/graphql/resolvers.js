"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pubsub = void 0;
const graphql_subscriptions_1 = require("graphql-subscriptions");
exports.pubsub = new graphql_subscriptions_1.PubSub();
let currentNumber = 0;
const resolvers = {
    Query: {
        test: () => {
            function incrementNumber() {
                currentNumber++;
                exports.pubsub.publish("ORDER", { order: currentNumber });
            }
            incrementNumber();
        }
    },
    Mutation: {
        createOrder: (_, args) => {
            console.log(args, "testing");
        }
    },
    Subscription: {
        order: {
            subscribe: () => exports.pubsub.asyncIterator(["ORDER"])
        }
    }
};
exports.default = resolvers;
