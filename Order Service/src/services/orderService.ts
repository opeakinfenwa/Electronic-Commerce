import axios from "axios";
import Order, { OrderStatus, PaymentMethod } from "../model/orderModel";
import { publishOrderCreatedEvent } from "../rabbitmq/publisher";
import { NotFoundError, ForbiddenError } from "../errors/customErrors";

interface CartItem {
  product: string;
  name: string;
  price: number;
  quantity: number;
}

interface CartResponse {
  success: boolean;
  cart: {
    _id: string;
    user: string;
    items: CartItem[];
    totalQuantity: number;
    totalPrice: number;
    __v?: number;
  };
}

export const createOrder = async (
  userId: string,
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  },
  paymentMethod: PaymentMethod,
  token: string
) => {
  const { data } = await axios.get<CartResponse>(`http://localhost:5002/cart`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const cart = data.cart;

  if (!cart || !Array.isArray(cart.items) || cart.items.length === 0) {
    console.error("Cart data malformed or empty:", data);
    throw new NotFoundError("Cart is empty or invalid");
  }

  const order = await Order.create({
    userId,
    items: cart.items.map((item: CartItem) => ({
      productId: item.product,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
    })),
    totalAmount: cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    ),
    status: OrderStatus.PENDING,
    address,
    paymentMethod,
  });

  await axios.delete(`http://localhost:5002/cart`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  await publishOrderCreatedEvent({
    orderId: order._id,
    userId: order.userId,
    items: order.items,
    totalAmount: order.totalAmount,
    status: order.status,
    address: order.address,
    createdAt: order.createdAt,
    paymentMethod,
  });

  return order;
};

export const getOrderDetails = async (
  orderId: string,
  userRole: string,
  userId: string
) => {
  const order = await Order.findById(orderId);
  if (!order) throw new NotFoundError("Order not found");

  if (order.userId.toString() !== userId && userRole !== "admin") {
    throw new ForbiddenError("Access denied: Not your order.");
  }

  return order;
};

export const getUserOrders = async (userId: string) => {
  const orders = await Order.find({ userId });
  if (!orders) throw new NotFoundError("Orders not found");
  return orders;
};