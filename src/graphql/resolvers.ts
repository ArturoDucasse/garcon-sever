import { PubSub, withFilter } from "graphql-subscriptions";
import { Request } from "express";

import MenuItem, { IMenuItem } from "../mongo/models/menuItem";
import { OrderInput, OrderStage } from "./typeDefs";

const pubsub = new PubSub();

const resolvers = {
  Query: {
    getUser() {},
    getUsersInTable() {}
  },
  Mutation: {
    async createOrder(_: any, args: any, context: Request) {
      const arg = args.input as OrderInput;
      const order: IMenuItem[] = [];
      if (!arg.order) throw new Error("No order in current order");
      if (!context.session) throw new Error("Session not created");

      if (context.session.order) {
        for (const item of arg.order) {
          context.session.order.push(item);
        }
        await populateOrder(arg, order);

        pubsub.publish("ORDER_CREATED", {
          orderCreated: {
            ...arg,
            order // sessionId: context.session.sessionId
          }
        });
        return "success";
      }

      await populateOrder(arg, order);

      pubsub.publish("ORDER_CREATED", {
        orderCreated: {
          ...arg,
          order,
          sessionId: 123 // sessionId: context.session.sessionId
        }
      });
      //Todo: Update the success message
      // context.session.userCredential!.order = arg.order;
      return "success";
    },
    orderComplete(_: any) {
      pubsub.publish("ORDER_STATUS", {
        orderStatus: { status: OrderStage.COMPLETE }
      });
      return "success";
    },
    updateOrder(_: any, args: any) {
      //Update order in user.session
      //Todo: Can only update orders for 5m (example)
      pubsub.publish("ORDER_STATUS", {
        orderStatus: {
          status: OrderStage.UPDATE,
          update: {
            order: args.order
          }
        }
      });
      return "success";
    },
    closeOrder(_: any, args: any) {
      //Delete session from database
      //Save Order in database
      pubsub.publish("ORDER_STATUS", {
        orderStatus: {
          status: OrderStage.DELETE
        }
      });
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
    orderStatus: {
      subscribe: withFilter(
        () => pubsub.asyncIterator("ORDER_STATUS"),
        ({ orderStatus }, variables: { sessionId: string }) => {
          return orderStatus.sessionId === variables.sessionId;
        }
      )
    }
  }
};

export default resolvers;

async function populateOrder(arg: OrderInput, order: IMenuItem[]) {
  for (const id of arg.order) {
    const item: IMenuItem | null = await MenuItem.findById(id);
    if (!item) throw new Error("document not found");
    item.imageUrl = "test"; //TODO: Delete this
    item.tableId = arg.tableId;
    order.push(item);
  }
}
