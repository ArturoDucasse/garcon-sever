import { Schema, Types, Model, model } from "mongoose";

export interface ISession {
  restaurantId: Types.ObjectId;
  tableId: number;
  order: [Types.ObjectId];
}

const sessionSchema = new Schema<ISession>({
  restaurantId: {
    type: Schema.Types.ObjectId,
    ref: "Restaurant",
    required: true
  },
  tableId: {
    type: Number,
    required: true
  },
  order: [Schema.Types.ObjectId]
});

const Session: Model<ISession> = model<ISession>("Session", sessionSchema);

export default Session;
