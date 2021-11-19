import { Types } from "mongoose";

declare module "express-session" {
  export interface SessionData {
    restaurantId: Types.ObjectId;
    tableId: number;
    order?: [Types.ObjectId];
  }
}
