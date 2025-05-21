import app from "./app";
import dotenv from "dotenv";
import connectDB from "./config/db";
import logger from "./config/logger";
import { connectRabbitMQ } from "./rabbitmq/connection";
import { startListeningForPaymentResults } from "./rabbitmq/consumer";

dotenv.config();

connectDB();

connectRabbitMQ()
  .then(() => {
    return startListeningForPaymentResults();
  })
  .then(() => {
    console.log("Order Service is listening for payment results...");
  })
  .catch((error) => {
    console.error("RabbitMQ setup failed in Order Service:", error);
  });

const PORT = process.env.PORT || 3003;
const server = app.listen(PORT, () => {
  logger.info(`Order Service running on port ${PORT}`);
});

export default server;