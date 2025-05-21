import app from "./app";
import dotenv from "dotenv";
import connectDB from "./config/db";
import logger from "./config/logger";
import { connectRabbitMQ } from "./rabbitmq/connection";
import { startListeningForPaymentEvents } from "./rabbitmq/consumer";

dotenv.config();

connectDB();

connectRabbitMQ()
  .then(() => {
    return startListeningForPaymentEvents();
  })
  .then(() => {
    console.log("Product Service is listening for payment events...");
  })
  .catch((error) => {
    console.error("RabbitMQ setup failed in Product Service:", error);
  });

const PORT = process.env.PORT || 3001;
const server = app.listen(PORT, () => {
  logger.info(`Product Service running on port ${PORT}`);
});

export default server;