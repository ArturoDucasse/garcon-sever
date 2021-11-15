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
    },
    test(_parent: any, _args: any, context: any) {
      // console.log(context.session, "context");
      context.session.test = "testing";
      return context.session.test + " " + "success";
    },
    test2(p: any, a: any, context: { session: { test: any } }) {
      return context.session.test;
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
