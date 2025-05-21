import payment from "../routes/paymentRoutes";
import { Express } from "express-serve-static-core";

const registerRoutes = function (app: Express) {
  app.use("/payment", payment);
};

export default registerRoutes;