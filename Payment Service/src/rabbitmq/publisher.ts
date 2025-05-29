import { getChannel } from "./connection";
import { PaymentStatus } from "../model/paymentModel";
import { Types } from "mongoose";

const PAYMENT_EXCHANGE_NAME = "payment_events";

interface PaymentItem {
  productId: Types.ObjectId;
  name: string;
  price: number;
  quantity: number;
}

interface PaymentEvent {
  orderId: Types.ObjectId;
  userId: Types.ObjectId;
  status: PaymentStatus;
  transactionId: string;
  items: PaymentItem[];
}

export const publishPaymentEvent = async (event: PaymentEvent) => {
  const channel = getChannel();

  const payload = {
    type: "PAYMENT_RESULT",
    data: event,
  };

  channel.publish(
    PAYMENT_EXCHANGE_NAME,
    "",
    Buffer.from(JSON.stringify(payload)),
    { contentType: "application/json" }
  );

  console.log("Published PAYMENT_RESULT event:", payload);
};
