import { Schema, Types, Model, model } from "mongoose";

export interface IMenu {
  name: string;
  menuItems: any;
  restaurantId: Types.ObjectId;
}

const menuSchema = new Schema<IMenu>({
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

const Menu: Model<IMenu> = model<IMenu>("Menu", menuSchema);

export default Menu;
