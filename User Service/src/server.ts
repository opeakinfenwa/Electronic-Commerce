import app from "./app";
import dotenv from "dotenv";
import connectDB from "./config/db";
import connectCloudinary from "./config/cloudinary";
import logger from "./config/logger";

dotenv.config();

connectDB();
connectCloudinary();

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

export default server;