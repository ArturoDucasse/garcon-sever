import MenuItem, { IMenuItem } from "../mongo/models/menuItem";
import { Types } from "mongoose";

export async function populateOrder(
  orders: [{ productId: Types.ObjectId; quantity: number }],
  tableId?: number
): Promise<IMenuItem[]> {
  const temp: IMenuItem[] = [];
  for (const order of orders) {
    const item: IMenuItem | null = await MenuItem.findById(order.productId);
    if (!item) throw new Error("document not found");
    item.imageUrl = "test"; //TODO: Delete this
    item._id = order.productId;
    item.quantity = order.quantity;
    if (tableId) item.tableId = tableId;
    //Todo?: item.name = arg.name:  Give the order the customer name
    temp.push(item);
  }
  return temp;
}
