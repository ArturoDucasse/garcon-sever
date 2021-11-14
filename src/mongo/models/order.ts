import { Schema, model, Model, Types } from "mongoose";

interface IOrder {
  orderItems: any;
  totalAmount: number;
  date: Date;
  restaurantId: number;
  tableId: number;
}

const orderSchema = new Schema<IOrder>({
  orderItems: {
    type: [Schema.Types.ObjectId],
    ref: "MenuItem",
    required: true
  },
  totalAmount: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
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
});

const Order: Model<IOrder> = model<IOrder>("Order", orderSchema);
export default Order;
