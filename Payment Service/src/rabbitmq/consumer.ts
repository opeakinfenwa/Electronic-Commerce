import { getChannel, ORDER_EXCHANGE_NAME } from "./connection";
import { processMockPayment } from "../services/paymentService";
import { publishPaymentEvent } from "./publisher";

export const startListeningForOrderEvents = async () => {
  const channel = getChannel();

  const queueName = "payment_order_created_queue";

  await channel.assertQueue(queueName, { durable: true });
  await channel.bindQueue(queueName, ORDER_EXCHANGE_NAME, "");

  channel.consume(queueName, async (message) => {
    if (message) {
      const eventPayload = JSON.parse(message.content.toString());
      const data = eventPayload.data;

      try {
        console.log("Received ORDER_CREATED event:", eventPayload);

        const payment = await processMockPayment({
          orderId: data.orderId,
          userId: data.userId,
          amount: data.totalAmount,
          paymentMethod: data.paymentMethod,
          items: data.items,
        });

        await publishPaymentEvent({
          orderId: data.orderId,
          userId: data.userId,
          status: payment.status,
          transactionId: payment.transactionId,
          items: payment.items,
        });

        channel.ack(message);
      } catch (error) {
        console.error("Error processing payment:", error);
        channel.nack(message);
      }
    }
  });

  console.log("Payment Service is listening for ORDER_CREATED events...");
};