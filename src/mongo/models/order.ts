import { Schema, model, Model } from "mongoose";

export interface IOrder {
  orderItems: any;
  totalAmount: number;
  restaurantId: number;
  tableId: number;
}

const orderSchema = new Schema<IOrder>(
  {
    orderItems: {
      type: [Schema.Types.ObjectId],
      ref: "MenuItem",
      required: true
    },
    totalAmount: {
      type: Number,
      required: true
    },
    restaurantId: {
      type: Number,
      required: true
    },
    tableId: {
      type: Number,
      required: true
    }
  },
  { timestamps: true }
);

const Order: Model<IOrder> = model<IOrder>("Order", orderSchema);
export default Order;
