import { getChannel, ORDER_EXCHANGE_NAME } from "./connection";
import { Types } from "mongoose";

export enum PaymentMethod {
  CARD = "card",
  WALLET = "wallet",
  BANK_TRANSFER = "bank_transfer",
  CASH_ON_DELIVERY = "cash_on_delivery",
}

interface OrderCreatedEvent {
  orderId: Types.ObjectId;
  userId: Types.ObjectId;
  items: {
    productId: Types.ObjectId;
    name: string;
    price: number;
    quantity: number;
  }[];
  totalAmount: number;
  status: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  paymentMethod: PaymentMethod;
  createdAt: Date;
}

export const publishOrderCreatedEvent = async (
  orderData: OrderCreatedEvent
) => {
  const channel = getChannel();

  const eventPayload = {
    type: "ORDER_CREATED",
    data: orderData,
  };

  channel.publish(
    ORDER_EXCHANGE_NAME,
    "",
    Buffer.from(JSON.stringify(eventPayload)),
    { contentType: "application/json" }
  );

  console.log("📤 Published ORDER_CREATED event");
};