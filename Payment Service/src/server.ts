import app from "./app";
import dotenv from "dotenv";
import connectDB from "./config/db";
import logger from "./config/logger";
import { connectRabbitMQ } from "./rabbitmq/connection";
import { startListeningForOrderEvents } from "./rabbitmq/consumer";

dotenv.config();

connectDB();

connectRabbitMQ()
  .then(() => {
    return startListeningForOrderEvents();
  })
  .then(() => {
    console.log("Payment Service is listening for order events...");
  })
  .catch((error) => {
    console.error("RabbitMQ setup failed in Payment Service:", error);
  });

const PORT = process.env.PORT || 3004;
const server = app.listen(PORT, () => {
  logger.info(`Payment Service running on port ${PORT}`);
});

export default server;