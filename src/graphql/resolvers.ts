import { IOrder } from "./../mongo/models/order";
import { PubSub, withFilter } from "graphql-subscriptions";
import { Request } from "express";
import { Types } from "mongoose";

import { IMenuItem } from "../mongo/models/menuItem";
import Order from "../mongo/models/order";
import {
  CreateOrderInput,
  OrderStage,
  UpdateOrderInput,
  CloseOrderInput
} from "./typeDefs";
import Session from "../mongo/models/session";
import { populateOrder } from "../utils/populateOrder";

const pubsub = new PubSub();

const resolvers = {
  Query: {
    async getUserDetails(_: any, args: any) {
      const arg = args.input as { userId: string };

      const user = await Session.findOne({ "session.userId": arg.userId });
      if (!user) throw new Error("User not found");
      const userOrder: IMenuItem[] = [];
      populateOrder(
        user.session.order as [{ productId: Types.ObjectId; quantity: number }],
        userOrder,
        user.session.tableId
      );

      return { order: userOrder, table: user.session.tableId };
    },
    async getUsersInTable(_: any, args: any) {
      const arg = args.input as { tableId: number; restaurantId: string };
      const users = await Session.find({
        "session.tableId": arg.tableId,
        "session.restaurantId": arg.restaurantId
      });

      const filteredUsers = users.map((user) => user.session);

      for (const user of filteredUsers) {
        const populatedOrder: IMenuItem[] = [];
        populateOrder(
          user.order as [{ productId: Types.ObjectId; quantity: number }],
          populatedOrder
        );
        user.order = populatedOrder;
      }

      return filteredUsers;
    },
    async getAllActiveUsers(_: any, args: any) {
      const arg = args.input as { restaurantId: string };

      const users = await Session.find({
        "session.restaurantId": arg.restaurantId
      });

      const filteredUsers = users.map((user) => user.session);

      for (const user of filteredUsers) {
        const populatedOrder: IMenuItem[] = [];
        populateOrder(
          user.order as [{ productId: Types.ObjectId; quantity: number }],
          populatedOrder
        );
        user.order = populatedOrder;
      }

      return filteredUsers;
    }
  },
  Mutation: {
    async createOrder(_: any, args: any, context: Request) {
      const arg = args.input as CreateOrderInput;
      const order: IMenuItem[] = [];
      let testing: any = [];
      if (!arg.order) throw new Error("Missing information from current order");
      if (!context.session) throw new Error("Missing user credentials ");

      if (!testing.length) {
        await populateOrder(arg.order, order, arg.tableId);

        pubsub.publish("ORDER_CREATED", {
          orderCreated: {
            ...arg,
            order,
            userId: "123", // userId: context.session.userId
            restaurantId: "321"
          }
        });
        testing = arg.order;
        return "success";
      }

      for (const item of arg.order) {
        testing.push(item);
      }
      await populateOrder(arg.order, order, arg.tableId);

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
    },
    orderComplete(_: any) {
      pubsub.publish("ORDER_STATUS", {
        orderStatus: { status: OrderStage.COMPLETE, userId: "123" }
      });
      return "success";
    },
    async updateOrder(_: any, args: any) {
      const arg = args.input as UpdateOrderInput;
      const user = await Session.findOne({ "session.userId": arg.userId });
      if (!user) throw new Error("User not found");
      // if (!user.session.order.length) throw new Error("Order empty");

      const newOrderIds = arg.order.map((item) => {
        return {
          productId: item._id as Types.ObjectId,
          quantity: item.quantity
        };
      });
      console.log(newOrderIds, "est");

      user.session.order = newOrderIds as [
        { productId: Types.ObjectId; quantity: number }
      ];
      user.save();
      pubsub.publish("ORDER_STATUS", {
        orderStatus: {
          userId: arg.userId,
          status: "UPDATE",
          update: {
            order: arg.order
          }
        }
      });
      return "success";
    },
    closeOrderAndSave(_: any, args: any) {
      const arg = args.input as CloseOrderInput;

      Session.deleteOne({
        "session.userId": arg.userId,
        "session.restaurantId": arg.restaurantId
      });

      const order = new Order({ ...arg });
      order.save();

      pubsub.publish("ORDER_STATUS", {
        orderStatus: {
          userId: args.userId,
          status: OrderStage.DELETE
        }
      });
      return "success";
    },
    closeOrder(_: any, args: any) {
      const arg = args.input as CloseOrderInput;

      Session.deleteOne({
        "session.userId": arg.userId,
        "session.restaurantId": arg.restaurantId
      });

      return "success";
    }
  },

  Subscription: {
    orderCreated: {
      subscribe: withFilter(
        () => pubsub.asyncIterator("ORDER_CREATED"),
        ({ orderCreated }, variables) => {
          console.log(orderCreated, variables);
          return orderCreated.restaurantId === variables.restaurantId;
        }
      )
    },
    orderStatus: {
      subscribe: withFilter(
        () => pubsub.asyncIterator("ORDER_STATUS"),
        ({ orderStatus }, variables: { userId: string }) => {
          console.log(orderStatus, "subscrition status");
          console.log(variables, "variables");
          return orderStatus.userId === variables.userId;
        }
      )
    }
  }
};

export default resolvers;
