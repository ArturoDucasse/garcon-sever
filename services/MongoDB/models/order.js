import mongoose from "mongoose";

const { Schema } = mongoose;

const orderSchema = new Schema({
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

const Order = mongoose.model("Order", orderSchema);
export default Order;
