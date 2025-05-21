import amqp from "amqplib";

let channel: amqp.Channel | null = null;

const ORDER_EXCHANGE_NAME = "order_events";
const PAYMENT_EXCHANGE_NAME = "payment_events";

export const connectRabbitMQ = async () => {
  try {
    const connection = await amqp.connect("amqp://localhost");
    channel = await connection.createChannel();

    await channel.assertExchange(ORDER_EXCHANGE_NAME, "fanout", {
      durable: true,
    });
    await channel.assertExchange(PAYMENT_EXCHANGE_NAME, "fanout", {
      durable: true,
    });

    console.log("✅ Connected to RabbitMQ");
  } catch (error) {
    console.error("RabbitMQ connection error:", error);
    throw error;
  }
};

export const getChannel = (): amqp.Channel => {
  if (!channel) {
    throw new Error("Channel not initialized. Call connectRabbitMQ() first.");
  }
  return channel;
};

export { ORDER_EXCHANGE_NAME, PAYMENT_EXCHANGE_NAME };