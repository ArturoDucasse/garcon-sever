import mongoose from "mongoose";

const { Schema } = mongoose;

const menuItemSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  menuId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Menu"
  }
});

const MenuItem = mongoose.model("MenuItem", menuItemSchema);
export default MenuItem;
