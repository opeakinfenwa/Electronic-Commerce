import { Request, Response, NextFunction } from "express";
import * as paymentService from "../services/paymentService";

export const getPaymentsByUserController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user.id;
    const payments = await paymentService.getPaymentsByUser(userId);

    res.status(200).json({
      success: true,
      payments,
    });
  } catch (error) {
    console.error("Error fetching user payments:", error);
    next(error);
  }
};

export const getPaymentByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { paymentId } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    const payment = await paymentService.getPaymentById(
      paymentId,
      userId,
      userRole
    );

    res.status(200).json({
      success: true,
      payment,
    });
  } catch (error) {
    console.error("Error fetching payment by ID:", error);
    next(error);
  }
};