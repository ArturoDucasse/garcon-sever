import { Request, Response, NextFunction } from "express";
import ShortUniqueId from "short-unique-id";

import Restaurant from "../mongo/models/restaurant";
import Menu from "../mongo/models/menu";
import MenuItems from "../mongo/models/menuItem";

export const getRestaurant = async (
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  try {
    const params = req.params;
    const lengthOfUniqueId = 12;
    const uid = new ShortUniqueId({ length: lengthOfUniqueId });
    const userId = uid() as string;
    const { restaurantId, tableId } = params;

    if (!req.session) throw new Error("Session not created");

    req.session.restaurantId = restaurantId;
    req.session.tableId = +tableId;
    req.session.userId = userId;

    const restaurant = await Restaurant.findById(params.restaurantId)
      .populate({
        path: "menus",
        model: Menu,
        populate: { path: "menuItems", model: MenuItems }
      })
      .lean();

    if (!restaurant) throw new Error("Restaurant not found");

    res.json({ ...restaurant, userId, tableId }).status(200);
  } catch (error: any) {
    // next(error); Create error handler
    res.status(404).json({ success: false, error: error.message });
  }
};
