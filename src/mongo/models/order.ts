import { Schema, model, Model, Types } from "mongoose";

export interface IOrder {
  order: any;
  totalAmount: number;
  restaurantId: string;
  tableId: number;
}

const orderSchema = new Schema<IOrder>(
  {
    order: {
      type: [{ productId: Schema.Types.ObjectId, quantity: Number }],
      ref: "MenuItem",
      required: true
    },
    restaurantId: {
      type: String,
      required: true
    },
    tableId: {
      type: Number,
      required: true
    },
    totalAmount: {
      type: Number,
      required: true
    }
  },
  { timestamps: true }
);

const Order: Model<IOrder> = model<IOrder>("Order", orderSchema);
export default Order;
