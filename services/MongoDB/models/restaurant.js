import mongoose from "mongoose";

const { Schema } = mongoose;

const restaurantSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  menus: {
    type: [Schema.Types.ObjectId],
    ref: "Menu",
    required: true
  }
});

const Restaurant = mongoose.model("Restaurant", restaurantSchema);
export default Restaurant;
