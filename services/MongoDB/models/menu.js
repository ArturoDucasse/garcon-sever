import mongoose from "mongoose";

const { Schema } = mongoose;

const menuSchema = new Schema({
  name: {
    type: String,
    required: true
  },

  menuItems: {
    type: [Schema.Types.ObjectId],
    ref: "MenuItem",
    required: true
  },
  restaurantId: {
    type: Schema.Types.ObjectId,
    ref: "Restaurant",
    required: true
  }
});

const Menu = mongoose.model("Menu", menuSchema);
export default Menu;
