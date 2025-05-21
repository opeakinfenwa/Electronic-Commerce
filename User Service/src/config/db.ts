import mongoose from "mongoose";
import dotenv from "dotenv";
import logger from "./logger";

dotenv.config();

const environment = () => {
  if (process.env.NODE_ENV === "production") {
    return process.env.MONGO_PROD;
  } else if (process.env.NODE_ENV === "test") {
    return process.env.MONGO_TEST;
  } else {
    return process.env.MONGO_URL;
  }
};

const connectDB = async () => {
  const db = environment();
  try {
    await mongoose.connect(db!);
    logger.info(`Connected to ${db}...`);

    const shutdown = async (signal: string) => {
      logger.info(`Received ${signal}. Closing database connection...`);
      await mongoose.connection.close();
      logger.info("Database connection closed.");
      process.exit(0);
    };

    process.on("SIGINT", () => shutdown("SIGINT"));
    process.on("SIGTERM", () => shutdown("SIGTERM"));
  } catch (error) {
    logger.error(`Failed to connect to database: ${error}`);
  }
};

export default connectDB;