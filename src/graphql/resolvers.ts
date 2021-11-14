import Restaurant from "../mongo/models/restaurant";

const resolvers = {
  Query: {
    async getRestaurant(
      _parent: any,
      { id }: any,
      context: { session: { user: any }; query: any },
      _info: any
    ) {
      context.session.user = context.query;
      const restaurant = await Restaurant.findById(id).populate({
        path: "menus",
        populate: { path: "menuItems" }
      });
      return restaurant;
    }
  },
  Mutation: {
    createOrder(parent: any, { ordersArray }: any, context: any, info: any) {
      // context.session.user.orders = ordersArray;
      return "Success";
    }
  }
};

export default resolvers;
