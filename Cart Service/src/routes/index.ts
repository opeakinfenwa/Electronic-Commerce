import cart from "../routes/cartRoutes";
import { Express } from "express-serve-static-core";

const registerRoutes = function (app: Express) {
  app.use("/cart", cart);
};

export default registerRoutes;