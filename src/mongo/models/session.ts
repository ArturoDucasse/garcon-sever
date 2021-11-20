import { Schema, Types, Model, model } from "mongoose";

export interface ISession {
  session: {
    restaurantId: Types.ObjectId;
    tableId: number;
    userId: string;
    order: [Types.ObjectId];
  };
}

const sessionSchema = new Schema<ISession>({
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
    userId: {
      type: String,
      required: true
    },
    order: [Schema.Types.ObjectId]
  }
});

const Session: Model<ISession> = model<ISession>("Session", sessionSchema);

export default Session;
