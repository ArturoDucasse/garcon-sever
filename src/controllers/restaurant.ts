import { Request, Response, NextFunction } from "express";
import { Types } from "mongoose";

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

    if (!req.session) throw new Error("Session not created");

    req.session.restaurantId = params.restaurantId as unknown as Types.ObjectId;
    req.session.tableId = +params.tableId;

    const restaurant = await Restaurant.findById(params.restaurantId).populate({
      path: "menus",
      model: Menu,
      populate: { path: "menuItems", model: MenuItems }
    });

    if (!restaurant) throw new Error("Restaurant not found");

    res.json(restaurant).status(200);
  } catch (error: any) {
    // next(error); Create error handler
    res.status(404).json({ success: false, error: error.message });
  }
};
