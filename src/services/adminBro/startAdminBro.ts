import AdminBro, { Router } from "admin-bro";
import AdminBroMongoose from "@admin-bro/mongoose";
import mongoConnection from "../../mongo/connection";
import AdminBroExpress from "@admin-bro/express";

AdminBro.registerAdapter(AdminBroMongoose);

type admin = [adminBro: AdminBro, router: any];

const startAdmin = async (): Promise<admin> => {
  const db = await mongoConnection();
  const adminBro = new AdminBro({
    databases: [db],
    resources: [],
    rootPath: "/admin"
  });
  const router = AdminBroExpress.buildRouter(adminBro);

  return [adminBro, router];
};

export default startAdmin;
