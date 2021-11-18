import { Schema, Types, Model, model } from "mongoose";

export interface IMenuItem {
  name: string;
  price: number;
  tableId: number;
  imageUrl: string;
  description: string;
  menuId: Types.ObjectId;
  userId?: string; //TODO: Make this mandatory
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
