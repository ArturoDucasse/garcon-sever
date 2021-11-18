import { PubSub, withFilter } from "graphql-subscriptions";
import { Request } from "express";

import MenuItem, { IMenuItem } from "../mongo/models/menuItem";
import { OrderInput } from "./typeDefs";

const pubsub = new PubSub();

const resolvers = {
  Query: {},
  Mutation: {
    async createOrder(_: any, args: any, context: Request) {
      const arg = args.input as OrderInput;
      //Todo: Get the restaurant ID with the session ~ req.session.restaurantId
      //Todo: Get the userId in the item ~ item.userId = req.session._id
      //Todo: throw error if order is empty
      const order: IMenuItem[] = [];

      for (const id of arg.order) {
        const item: IMenuItem | null = await MenuItem.findById(id);
        if (!item) throw new Error("Item not found");
        item.imageUrl = "test"; //Todo: Delete this
        item.tableId = arg.tableId;
        order.push(item);
      }

      pubsub.publish("ORDER_CREATED", {
        orderCreated: {
          restaurantId: arg.restaurantId, //Change this to context.session.restaurantId
          // userId: context.session.userId,
          tableId: arg.tableId,
          order
        }
      });
      //Todo: Update the success message
      return "success";
    },
    async orderComplete(_: any, _args: any) {
      pubsub.publish("ORDER_COMPLETE", { isOrderComplete: "hola" });
      return "success";
    }
  },

  Subscription: {
    orderCreated: {
      subscribe: withFilter(
        () => pubsub.asyncIterator("ORDER_CREATED"),
        ({ orderCreated }, variables) => {
          return orderCreated.restaurantId === variables.restaurantId;
        }
      )
    },
    isOrderComplete: {
      subscribe: () => pubsub.asyncIterator(["ORDER_COMPLETE"])
    }
  }
};

export default resolvers;
