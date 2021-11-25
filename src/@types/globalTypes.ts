import { Types } from "mongoose";

// declare module "express-session" {
//   export interface SessionData {
//     restaurantId: Types.ObjectId;
//     tableId: number;
//     order?: [{ productId: Types.ObjectId; quantity: number }];
//   }
// }

declare global {
  namespace Express {
    interface Session {
      restaurantId: string;
      tableId: number;
      order?: [{ productId: Types.ObjectId; quantity: number }];
      userId: string;
    }
  }
}
