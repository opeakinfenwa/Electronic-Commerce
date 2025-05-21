import { Types } from "mongoose";
import { v4 as uuidv4 } from "uuid";
import Payment, { PaymentStatus, PaymentMethod } from "../model/paymentModel";
import { NotFoundError, ForbiddenError } from "../errors/customErrors";

interface CreatePaymentInput {
  orderId: Types.ObjectId;
  userId: Types.ObjectId;
  amount?: number;
  paymentMethod?: PaymentMethod;
  items?: {
    productId: Types.ObjectId;
    name: string;
    price: number;
    quantity: number;
  }[];
}

export const processMockPayment = async ({
  orderId,
  userId,
  amount,
  paymentMethod,
  items,
}: CreatePaymentInput) => {
  const transactionId = uuidv4();

  await new Promise((resolve) => setTimeout(resolve, 1000));

  let status: PaymentStatus;

  if (paymentMethod === PaymentMethod.CASH_ON_DELIVERY) {
    status = PaymentStatus.PENDING;
  } else {
    const success = Math.random() > 0.2;
    status = success ? PaymentStatus.SUCCESS : PaymentStatus.FAILED;
  }

  const payment = await Payment.create({
    orderId,
    userId,
    amount,
    status,
    paymentMethod,
    transactionId,
    items,
  });

  return payment;
};

export const getPaymentsByUser = async (userId: string) => {
  const payments = await Payment.find({ userId });

  if (!payments || payments.length === 0) {
    throw new NotFoundError("No payments found for this user");
  }

  return payments;
};

export const getPaymentById = async (
  paymentId: string,
  userId: string,
  userRole: string
) => {
  const payment = await Payment.findById(paymentId);

  if (!payment) {
    throw new NotFoundError("Payment not found");
  }

  if (payment.userId.toString() !== userId && userRole !== "admin") {
    throw new ForbiddenError(
      "Access denied. Not authorized to view this payment"
    );
  }

  return payment;
};