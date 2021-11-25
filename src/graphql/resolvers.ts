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
  CloseSingleOrderInput,
  CloseSingleOrderAndSaveInput,
  CloseTableOrdersInput,
  CloseTableOrdersAndSaveInput
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

      const filteredUsers = users.map((user) => user.session);

      for (const user of filteredUsers) {
        const order = await populateOrder(
          user.order as [{ productId: Types.ObjectId; quantity: number }]
        );
        user.populatedOrder = order;
      }

      return filteredUsers;
    },
    async getMenuItem(_: any, args: any) {
      const arg = args as { menuItemId: Types.ObjectId };
      const menuItem = MenuItem.findById(arg.menuItemId);
      return menuItem;
    }
  },
  Mutation: {
    async createOrder(_: any, args: any, context: Request) {
      const arg = args.input as CreateOrderInput;

      // const user = context as unknown as ISession;
      //Todo: Test the context (a.k.a = req.session) in the creation of the order
      const user = await Session.findOne({
        "session.userId": arg.userId,
        "session.restaurantId": arg.restaurantId
      });

      if (!user) throw new Error("User not found");

      if (!arg.order) throw new Error("Missing information from current order");
      // if (!context.session) throw new Error("Missing user credentials ");

      if (!user.session.order.length) {
        const order = await populateOrder(arg.order, arg.tableId);

        pubsub.publish("ORDER_CREATED", {
          orderCreation: {
            ...arg,
            order,
            userId: arg.userId, // userId: context.session.userId
            restaurantId: arg.restaurantId
          }
        });
        user.session.populatedOrder = order;
        user.session.order = arg.order;
        await user.save();
        return "success";
      }

      //TODO: ask thulk what the hell is wrong
      // for (const item of arg.order) {
      //   user.session.order.push(item);
      // }

      const order = await populateOrder(arg.order, arg.tableId);

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
      if (!user.session.order.length) throw new Error("Order empty");

      const updateOrder = arg.order.map((item) => {
        return {
          productId: item._id as Types.ObjectId,
          quantity: item.quantity
        };
      });

      user.session.order = updateOrder as [
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
    async closeSingleOrder(_: any, args: any) {
      const arg = args.input as CloseSingleOrderInput;

      await Session.deleteOne({
        "session.restaurantId": arg.restaurantId,
        "session.userId": arg.userId
      });

      pubsub.publish("ORDER_STATUS", {
        orderStatus: {
          userId: arg.userId,
          status: OrderStage.DELETE
        }
      });

      return "success";
    },
    async closeSingleOrderAndSave(_: any, args: any) {
      const arg = args.input as CloseSingleOrderAndSaveInput;

      const user = await Session.findOne({
        "session.userId": arg.userId,
        "session.restaurantId": arg.restaurantId
      });

      if (!user) throw new Error("User not found");
      //Todo?: Throw an error if the quantity isn't in the order

      const { order, restaurantId, tableId } = user.session;

      const populatedOrder = await populateOrder(order);
      const orderPrices = populatedOrder.map(
        (item) => item.price * item.quantity!
      );

      const totalAmount = orderPrices.reduce(
        (acc, current) => (acc += current)
      );

      const newOrder = new Order({ order, restaurantId, tableId, totalAmount });
      await newOrder.save();

      await Session.deleteOne({
        "session.userId": arg.userId,
        "session.restaurantId": arg.restaurantId
      });

      pubsub.publish("ORDER_STATUS", {
        orderStatus: {
          userId: arg.userId,
          status: OrderStage.DELETE
        }
      });
      return "success";
    },
    async closeTableOrders(_: any, args: any) {
      const arg = args.input as CloseTableOrdersInput;

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
    },
    async closeTableOrdersAndSave(_: any, args: any) {
      const arg = args.input as CloseTableOrdersAndSaveInput;

      const users = await Session.find({
        "session.tableId": arg.tableId,
        "session.restaurantId": arg.restaurantId
      });

      const filteredUsers = users.map((user) => user.session);

      for (const user of filteredUsers) {
        const { order, restaurantId, tableId } = user;

        const populatedOrder = await populateOrder(order);
        const orderPrices = populatedOrder.map(
          (item) => item.price * item.quantity!
        );

        const totalAmount = orderPrices.reduce(
          (acc, current) => (acc += current)
        );

        const newOrder = new Order({
          order,
          restaurantId,
          tableId,
          totalAmount
        });
        await newOrder.save();

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
          // console.log(orderStatus, "status");
          // console.log(variables, "variables");
          return orderStatus.userId === variables.userId;
        }
      )
    }
  }
};

export default resolvers;
