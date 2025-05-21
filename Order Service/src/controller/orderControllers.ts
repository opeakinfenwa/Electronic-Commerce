import { NextFunction, Request, Response } from "express";
import * as orderService from "../services/orderService";
import { CreateOrderSchema } from "../validation/orderValidation";

export const createOrderController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const parseResult = CreateOrderSchema.safeParse(req.body);

    if (!parseResult.success) {
      return res.status(400).json({
        message: "Validation failed",
        errors: parseResult.error.errors,
      });
    }

    const { address, paymentMethod } = parseResult.data;
    const userId = req.user.id;
    const token =
      req.cookies?.token ||
      (req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
        ? req.headers.authorization.split(" ")[1]
        : null);

    const order = await orderService.createOrder(
      userId,
      address,
      paymentMethod,
      token
    );
    return res.status(201).json({ success: true, order });
  } catch (error) {
    console.error("Error creating order:", error);
    next(error);
  }
};

export const getOrderDetailsController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { orderId } = req.params;
    const userRole = req.user.role;
    const userId = req.user.id;

    const order = await orderService.getOrderDetails(orderId, userRole, userId);
    res.status(200).json({ success: true, order });
  } catch (error) {
    console.error("Error getting order details:", error);
    next(error);
  }
};

export const getUserOrdersController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user.id;
    const orders = await orderService.getUserOrders(userId);
    res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error("Error getting user orders cart:", error);
    next(error);
  }
};