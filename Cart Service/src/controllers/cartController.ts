import { NextFunction, Request, Response } from "express";
import {
  addToCartService,
  updateCartService,
  removeCartItemService,
  clearCartService,
  getCartByUserId,
  deleteCartByUserId,
} from "../services/cartService";
import { ObjectId } from "bson";
import { Types } from "mongoose";

export const addToCartController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { productId, quantity } = req.body;

    const token =
      req.cookies?.token ||
      (req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
        ? req.headers.authorization.split(" ")[1]
        : null);

    const cart = await addToCartService(
      req.user.id,
      productId,
      quantity,
      token
    );

    res.status(200).json({
      success: true,
      message: "Product added to cart successfuly",
      cart,
    });
  } catch (error) {
    console.error("Error adding cart to product:", error);
    next(error);
  }
};

export const updateCartController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { productId, quantity } = req.body;
    const userId = new ObjectId(req.user.id as string);
    const objectProductId = new ObjectId(productId as string);

    const cart = await updateCartService(userId, objectProductId, quantity);

    res.status(200).json({
      success: true,
      message: "Cart updated successfuly",
      cart,
    });
  } catch (error) {
    console.error("Error updating cart:", error);
    next(error);
  }
};

export const removeCartItemController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { productId } = req.params;
    const userId = req.user.id;

    const updatedCart = await removeCartItemService(userId, productId);

    res.status(200).json({
      success: true,
      message: "Cart item succesfully removed",
      cart: updatedCart,
    });
  } catch (error) {
    console.error("Error removing cart item:", error);
    next(error);
  }
};

export const clearCartController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user.id;
    await clearCartService(userId);

    res.status(200).json({
      success: true,
      message: "Cart cleared successfuly",
    });
  } catch (error) {
    console.error("Error clearing cart:", error);
    next(error);
  }
};

export const getCartController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const userIdFromToken = req.user.id;

  try {
    const objectId = new Types.ObjectId(userIdFromToken);
    const cart = await getCartByUserId(objectId);

    res.status(200).json({
      success: true,
      cart,
    });
  } catch (error) {
    console.error("Error clearing cart:", error);
    next(error);
  }
};

export const deleteCartController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const userIdFromToken = req.user.id;
  try {
    const objectId = new Types.ObjectId(userIdFromToken);
    const cart = await deleteCartByUserId(objectId);

    res.status(200).json({ message: "Cart deleted successfully" });
  } catch (error) {
    console.error("Error deleting cart:", error);
    next(error);
  }
};