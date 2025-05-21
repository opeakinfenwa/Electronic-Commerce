import amqp from "amqplib";

let channel: amqp.Channel | null = null;
export const PAYMENT_EXCHANGE_NAME = "payment_events";

export const connectRabbitMQ = async () => {
  try {
    const connection = await amqp.connect("amqp://localhost");
    channel = await connection.createChannel();
    await channel.assertExchange(PAYMENT_EXCHANGE_NAME, "fanout", {
      durable: true,
    });
    console.log("Product Service connected to RabbitMQ");
  } catch (error) {
    console.error("RabbitMQ connection error in Product Service:", error);
    throw error;
  }
};

export const getChannel = (): amqp.Channel => {
  if (!channel) {
    throw new Error("Channel not initialized. Call connectRabbitMQ() first.");
  }
  return channel;
};