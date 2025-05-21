import express from "express";
import cookieParser from "cookie-parser";
import registerRoutes from "./routes";
import { errorHandler } from "./errors/handleErrors";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

registerRoutes(app);

app.use(errorHandler);

export default app;