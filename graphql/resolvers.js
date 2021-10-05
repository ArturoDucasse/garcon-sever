import Restaurant from "../services/MongoDB/models/restaurant.js";

const resolvers = {
  Query: {
    async getRestaurant(parent, { id }, context, info) {
      context.session.user = context.query;
      const restaurant = await Restaurant.findById(id).populate({
        path: "menus",
        populate: { path: "menuItems" }
      });
      return restaurant;
    }
  },
  Mutation: {
    createOrder(parent, { ordersArray }, context, info) {
      // context.session.user.orders = ordersArray;
      return "Success";
    }
  }
};

export default resolvers;
