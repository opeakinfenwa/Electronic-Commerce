import category from "./categoryRoutes";
import product from "./productRoutes";
import { Express } from "express-serve-static-core";

const registerRoutes = function (app: Express) {
  app.use("/category", category);
  app.use("/product", product);
};

export default registerRoutes;