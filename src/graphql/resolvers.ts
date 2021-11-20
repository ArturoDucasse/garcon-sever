import { IOrder } from "./../mongo/models/order";
import { PubSub, withFilter } from "graphql-subscriptions";
import { Request } from "express";
import { Types } from "mongoose";

import MenuItem, { IMenuItem } from "../mongo/models/menuItem";
import Order from "../mongo/models/order";
import { OrderInput, OrderStage, UpdateOrderInput } from "./typeDefs";
import Session from "../mongo/models/session";

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
      if (!arg.order) throw new Error("Missing information from current order");
      if (!context.session) throw new Error("Missing user credentials ");

      if (!context.session.order.length) {
        for (const item of arg.order) {
          context.session.order.push(item);
        }
        await populateOrder(arg, order);

        pubsub.publish("ORDER_CREATED", {
          orderCreated: {
            ...arg,
            order,
            userId: "123",
            restaurantId: "321"

            // userId: context.session.userId
            //restaurantId: context.session.restaurantId
          }
        });
        return "success";
      }

      await populateOrder(arg, order);

      pubsub.publish("ORDER_CREATED", {
        orderCreated: {
          ...arg,
          order,
          userId: "123", // userId: context.session.userId
          restaurantId: "321"
        }
      });
      //Todo: Update the success message
      //Todo: Only send a order to the subscription if the order is stored in the context.session,
      // as well, only save in the context.session if the order was send to the subscription
      context.session.order = arg.order;
      return "success";
    },
    orderComplete(_: any) {
      pubsub.publish("ORDER_STATUS", {
        orderStatus: { status: OrderStage.COMPLETE }
      });
      return "success";
    },
    async updateOrder(_: any, args: any) {
      const arg = args.input as UpdateOrderInput;
      const user = await Session.findOne({ "session.userId": arg.userId });
      if (!user) throw new Error("User not found");
      const newOrderIds: Types.ObjectId[] = arg.order.map((item) => item._id);

      user.session.order = newOrderIds as [Types.ObjectId];
      user.save();
      pubsub.publish("ORDER_STATUS", {
        orderStatus: {
          userId: arg.userId,
          status: "UPDATE",
          update: {
            order: args.order
          }
        }
      });
      return "success";
    },
    closeOrderAndSave(_: any, args: any) {
      //Delete session from database
      const arg = args.input as {
        userId: string;
        restaurantId: string;
        order: IOrder;
      };

      Session.deleteOne({
        "session.userId": arg.userId,
        "session.restaurantId": arg.restaurantId
      });

      const order = new Order({ ...arg.order });
      order.save();

      //Save Order in database
      pubsub.publish("ORDER_STATUS", {
        orderStatus: {
          userId: args.userId,
          status: OrderStage.DELETE
        }
      });
      return "success";
    },
    closeOrder(_: any, args: any) {
      //Delete session from database
      const arg = args.input as {
        userId: string;
        restaurantId: string;
        order: IOrder;
      };

      Session.deleteOne({
        "session.userId": arg.userId,
        "session.restaurantId": arg.restaurantId
      });

      return "success";
    },
    async closeAllOrdersInTable(_: any, args: any) {
      const arg = args.input as { restaurantId: string; tableId: number };
      const deletedSessions = await Session.deleteMany({
        "session.tableId": arg.tableId,
        "session.restaurantId": arg.restaurantId
      });

      console.log(deletedSessions, "testing");
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
        ({ orderStatus }, variables: { userId: string }) => {
          // console.log(orderStatus, "subscrition status");
          return orderStatus.userId === variables.userId;
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
    //Todo?: item.name = arg.name:  Give the order the customer name
    order.push(item);
  }
}
