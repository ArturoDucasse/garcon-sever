import { Schema, Types, Model, model } from "mongoose";

export interface ISession {
  _id: Schema.Types.ObjectId;
  session: {
    restaurantId: Types.ObjectId;
    tableId: number;
    order: [Types.ObjectId];
  };
}

const sessionSchema = new Schema<ISession>({
  _id: Schema.Types.ObjectId,
  session: {
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
  }
});

const Session: Model<ISession> = model<ISession>("Session", sessionSchema);

export default Session;
