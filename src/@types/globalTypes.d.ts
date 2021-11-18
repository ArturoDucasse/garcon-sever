import { IOrder } from "../mongo/models/order";
import { Types } from "mongoose";

export type Credentials = {
  restaurantId: Types.ObjectId;
  tableId: number;
};
declare module "express-session" {
  interface SessionData {
    userCredential: Credentials;
  }
}
