import user from "./userRoutes";
import auth from "./authRoutes";
import { Express } from "express-serve-static-core";

const registerRoutes = function (app: Express) {
  app.use("/user", user);
  app.use("/auth", auth);
};

export default registerRoutes;