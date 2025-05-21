import { getChannel, PAYMENT_EXCHANGE_NAME } from "./connection";
import Order, { OrderStatus } from "../model/orderModel";

interface PaymentItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

interface PaymentResultEvent {
  type: "PAYMENT_RESULT";
  data: {
    orderId: string;
    userId: string;
    status: "SUCCESS" | "FAILED";
    transactionId: string;
    items: PaymentItem[];
  };
}

const QUEUE_NAME = "payment_order_result_queue";

export const startListeningForPaymentResults = async () => {
  const channel = getChannel();

  await channel.assertQueue(QUEUE_NAME, { durable: true });
  await channel.bindQueue(QUEUE_NAME, PAYMENT_EXCHANGE_NAME, "");

  channel.consume(QUEUE_NAME, async (message) => {
    if (message) {
      const event = JSON.parse(
        message.content.toString()
      ) as PaymentResultEvent;

      if (event.type === "PAYMENT_RESULT") {
        try {
          const newStatus =
            event.data.status === "SUCCESS"
              ? OrderStatus.SUCCESS
              : OrderStatus.FAILED;

          const updatedOrder = await Order.findByIdAndUpdate(
            event.data.orderId,
            { status: newStatus },
            { new: true }
          );

          console.log(
            `Order ${event.data.orderId} updated to status: ${updatedOrder?.status}`
          );

          channel.ack(message);
        } catch (error) {
          console.error("Failed to update order status:", error);
          channel.nack(message);
        }
      } else {
        channel.ack(message);
      }
    }
  });
};