import order from "./orderRoutes";
import { Express } from "express-serve-static-core";

const registerRoute = function (app: Express) {
  app.use("/orders", order);
};

export default registerRoute;