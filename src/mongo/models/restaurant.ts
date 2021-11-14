import { model, Model, Schema } from "mongoose";

interface IRestaurant {
  name: string;
  description: string;
  menus: [Schema.Types.ObjectId];
}

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

const Restaurant: Model<IRestaurant> = model<IRestaurant>(
  "Restaurant",
  restaurantSchema
);

export default Restaurant;
