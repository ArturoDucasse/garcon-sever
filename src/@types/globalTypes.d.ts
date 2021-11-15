import { IOrder } from "../mongo/models/order";

declare module "express-session" {
  interface SessionData {
    table: number;
    orderItems: any;
    hehe: string;
    hola: string;
  }
}
