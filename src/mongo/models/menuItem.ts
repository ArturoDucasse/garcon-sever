import { Schema, Types, Model, model } from "mongoose";

interface IMenuItem {
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  menuId: Types.ObjectId;
}

const menuItemSchema = new Schema<IMenuItem>({
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

const MenuItem: Model<IMenuItem> = model<IMenuItem>("MenuItem", menuItemSchema);
export default MenuItem;
