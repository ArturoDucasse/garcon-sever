import { IOrder } from "./../mongo/models/order";
import { PubSub, withFilter } from "graphql-subscriptions";
import { Request } from "express";
import { Types } from "mongoose";

import MenuItem, { IMenuItem } from "../mongo/models/menuItem";
import Order from "../mongo/models/order";
import {
  CreateOrderInput,
  OrderStage,
  UpdateOrderInput,
  CloseOrderInput
} from "./typeDefs";
import Session, { ISession } from "../mongo/models/session";
import { populateOrder } from "../utils/populateOrder";

const pubsub = new PubSub();

const resolvers = {
  Query: {
    async getUserDetails(_: any, args: any) {
      const arg = args as { userId: string };

      const user = await Session.findOne({ "session.userId": arg.userId });
      if (!user) throw new Error("User not found");
      const order = await populateOrder(
        user.session.order as [{ productId: Types.ObjectId; quantity: number }],
        user.session.tableId
      );

      return { order, tableId: user.session.tableId, userId: arg.userId };
    },
    async getUsersInTable(_: any, args: any) {
      const arg = args.input as { tableId: number; restaurantId: string };
      const users = await Session.find({
        "session.restaurantId": arg.restaurantId
      });

      const filteredUsers = users.map((user) => user.session);

      for (const user of filteredUsers) {
        const order = await populateOrder(
          user.order as [{ productId: Types.ObjectId; quantity: number }]
        );
        user.populatedOrder = order;
      }

      return filteredUsers;
    },
    async getAllActiveUsers(_: any, args: any) {
      const users = await Session.find({
        "session.restaurantId": args.restaurantId
      });

      console.log(users, "users");
      const filteredUsers = users.map((user) => user.session);

      for (const user of filteredUsers) {
        const populatedOrder: IMenuItem[] = [];
        populateOrder(
          user.order as [{ productId: Types.ObjectId; quantity: number }]
        );
        user.populatedOrder = populatedOrder;
      }

      return filteredUsers;
    },
    async getMenuItem(_: any, args: any) {
      const arg = args.input as { itemMenuId: Types.ObjectId };
      const menuItem = MenuItem.findById(arg.itemMenuId);
      return menuItem;
    }
  },
  Mutation: {
    async createOrder(_: any, args: any, context: Request) {
      const arg = args.input as CreateOrderInput;

      const user = context as unknown as ISession;

      if (!user) throw new Error("User not authenticated");

      const order: IMenuItem[] = [];
      if (!arg.order) throw new Error("Missing information from current order");
      // if (!context.session) throw new Error("Missing user credentials ");

      if (!user.session.order.length) {
        await populateOrder(arg.order, arg.tableId);

        pubsub.publish("ORDER_CREATED", {
          orderCreation: {
            ...arg,
            order,
            userId: "123", // userId: context.session.userId
            restaurantId: "615b5d11899fe6bbba8822d4"
          }
        });
        user.session.order = arg.order;
        return "success";
      }

      // for (const item of arg.order) {
      //   user.session.order.push(item);
      // }

      await populateOrder(arg.order, arg.tableId);

      pubsub.publish("ORDER_CREATED", {
        orderCreation: {
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
    orderComplete(_: any, args: { userId: string }) {
      pubsub.publish("ORDER_STATUS", {
        orderStatus: { status: OrderStage.COMPLETE, userId: args.userId }
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
    async closeOrderAndSave(_: any, args: any) {
      const arg = args.input as CloseOrderInput;

      Session.deleteOne({
        "session.userId": arg.userId,
        "session.restaurantId": arg.restaurantId
      });

      const order = new Order({ ...arg });
      await order.save();

      pubsub.publish("ORDER_STATUS", {
        orderStatus: {
          userId: args.userId,
          status: OrderStage.DELETE
        }
      });
      return "success";
    },
    async closeOrder(_: any, args: any) {
      const arg = args.input as CloseOrderInput;

      console.log(arg, "arguments ");

      const test = await Session.findOne({
        "session.restaurantId": arg.restaurantId
      });

      console.log(test, "testing");

      return "success";
    },
    async closeAllOrdersInTableAndSave(_: any, args: any) {
      const arg = args.input as CloseOrderInput;

      const users = await Session.find({
        "session.tableId": arg.tableId,
        "session.restaurantId": arg.restaurantId
      });

      const filteredUsers = users.map((user) => user.session);

      for (const user of filteredUsers) {
        const { cookie, ...rest } = user;
        const order = new Order({ ...rest });
        await order.save();

        pubsub.publish("ORDER_STATUS", {
          orderStatus: {
            userId: user.userId,
            status: OrderStage.DELETE
          }
        });
      }

      await Session.deleteMany({
        "session.tableId": arg.tableId,
        "session.restaurantId": arg.restaurantId
      });

      return "success";
    },
    async closeAllOrdersInTable(_: any, args: any) {
      const arg = args.input as CloseOrderInput;

      const users = await Session.find({
        "session.tableId": arg.tableId,
        "session.restaurantId": arg.restaurantId
      });

      const filteredUsers = users.map((user) => user.session);

      for (const user of filteredUsers) {
        pubsub.publish("ORDER_STATUS", {
          orderStatus: {
            userId: user.userId,
            status: OrderStage.DELETE
          }
        });
      }

      await Session.deleteMany({
        "session.tableId": arg.tableId,
        "session.restaurantId": arg.restaurantId
      });

      return "success";
    }
  },

  Subscription: {
    orderCreation: {
      subscribe: withFilter(
        () => pubsub.asyncIterator("ORDER_CREATED"),
        ({ orderCreation }, variables) => {
          // console.log(orderCreation, "orderCreation");
          // console.log(variables, "variables");
          return orderCreation.restaurantId === variables.restaurantId;
        }
      )
    },
    orderStatus: {
      subscribe: withFilter(
        () => pubsub.asyncIterator("ORDER_STATUS"),
        ({ orderStatus }, variables: { userId: string }) => {
          return orderStatus.userId === variables.userId;
        }
      )
    }
  }
};

export default resolvers;
