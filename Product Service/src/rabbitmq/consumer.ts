import { getChannel, PAYMENT_EXCHANGE_NAME } from "./connection";
import { updateProductStock } from "../services/productService";

interface PaymentResultEvent {
  type: "PAYMENT_RESULT";
  data: {
    orderId: string;
    userId: string;
    status: "SUCCESS" | "FAILED";
    transactionId: string;
    items: {
      productId: string;
      quantity: number;
    }[];
  };
}

const QUEUE_NAME = "payment_product_update_queue";

export const startListeningForPaymentEvents = async () => {
  const channel = getChannel();

  await channel.assertQueue(QUEUE_NAME, { durable: true });
  await channel.bindQueue(QUEUE_NAME, PAYMENT_EXCHANGE_NAME, "");

  channel.consume(QUEUE_NAME, async (message) => {
    if (message) {
      const event = JSON.parse(
        message.content.toString()
      ) as PaymentResultEvent;

      if (event.type === "PAYMENT_RESULT" && event.data.status === "SUCCESS") {
        console.log("Received PAYMENT_SUCCESS:", event.data);

        try {
          await updateProductStock(event.data.items);
          console.log(
            "Product stock updated for order:",
            event.data.orderId
          );
          channel.ack(message);
        } catch (err) {
          console.error("Failed to update product stock:", err);
          channel.nack(message);
        }
      } else {
        channel.ack(message);
      }
    }
  });
};