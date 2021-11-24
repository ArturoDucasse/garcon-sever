import { Schema, Types, Model, model } from "mongoose";
import { IMenuItem } from "../../mongo/models/menuItem";

export interface ISession {
  _id: string;
  session: {
    restaurantId: string;
    tableId: number;
    userId: string;
    cookie: object;
    order: [{ productId: Types.ObjectId; quantity: number }];
    populatedOrder: IMenuItem[];
  };
}

const sessionSchema = new Schema<ISession>({
  _id: String,
  session: {
    restaurantId: {
      type: String,
      ref: "Restaurant",
      required: true
    },
    tableId: {
      type: Number,
      required: true
    },
    cookie: {},
    userId: {
      type: String,
      required: true
    },
    order: [{ productId: Schema.Types.ObjectId, quantity: Number }]
  }
});

const Session: Model<ISession> = model<ISession>("Session", sessionSchema);

export default Session;
