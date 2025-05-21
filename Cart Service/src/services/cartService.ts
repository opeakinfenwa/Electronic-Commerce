import axios from "axios";
import cartModel from "../model/cartModel";
import { ObjectId } from "bson";
import { BadRequestError, NotFoundError } from "../errors/customErrors";
import { Types } from "mongoose";

export const addToCartService = async (
  userId: string,
  productId: string,
  quantity: number,
  token: string | null
) => {
  const objectIdProductId = new ObjectId(productId);

  const productResponse = await axios.get(
    `http://localhost:5001/product/${productId}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  const product = productResponse.data.product;
  if (!product || !quantity) {
    throw new BadRequestError("Invalid product data from product service");
  }

  let cart = await cartModel.findOne({ user: userId });
  if (!cart) {
    cart = new cartModel({
      user: userId,
      items: [],
      totalQuantity: 0,
      totalPrice: 0,
    });
  }

  const existingItem = cart.items.find(
    (item) => item.product.toString() === productId
  );
  if (existingItem) {
    existingItem.quantity += quantity;
    existingItem.totalPrice = existingItem.quantity * product.price;
  } else {
    cart.items.push({
      product: objectIdProductId,
      name: product.name,
      price: product.price,
      quantity,
      totalPrice: quantity * product.price,
    });
  }

  cart.totalQuantity = cart.items.reduce((sum, item) => sum + item.quantity, 0);
  cart.totalPrice = cart.items.reduce((sum, item) => sum + item.totalPrice, 0);

  await cart.save();
  return cart;
};

export const updateCartService = async (
  userId: ObjectId,
  productId: ObjectId,
  quantity: number
) => {
  const cart = await cartModel.findOne({ user: userId });

  if (!cart) {
    throw new NotFoundError("Cart not found");
  }

  const item = cart.items.find(
    (item) => item.product.toString() === productId.toString()
  );
  if (!item) {
    throw new NotFoundError("Product not found in cart");
  }

  item.quantity = quantity;
  item.totalPrice = quantity * item.price;

  cart.totalQuantity = cart.items.reduce((sum, item) => sum + item.quantity, 0);
  cart.totalPrice = cart.items.reduce((sum, item) => sum + item.totalPrice, 0);

  await cart.save();
  return cart;
};

export const removeCartItemService = async (
  userId: string,
  productId: string
) => {
  const cart = await cartModel.findOne({ user: new ObjectId(userId) });

  if (!cart) {
    throw new NotFoundError("Cart not found");
  }

  cart.items = cart.items.filter(
    (item) => item.product.toString() !== productId
  );

  cart.totalQuantity = cart.items.reduce((sum, item) => sum + item.quantity, 0);
  cart.totalPrice = cart.items.reduce((sum, item) => sum + item.totalPrice, 0);

  await cart.save();
  return cart;
};

export const clearCartService = async (userId: string) => {
  const cart = await cartModel.findOne({ user: new ObjectId(userId) });

  if (!cart) {
    throw new NotFoundError("Cart not found");
  }

  cart.items = [];
  cart.totalQuantity = 0;
  cart.totalPrice = 0;

  await cart.save();
  return cart;
};

export const getCartByUserId = async (id: Types.ObjectId) => {
  const cart = await cartModel.findOne({ user: id });
  if (!cart) {
    throw new NotFoundError("Cart not found");
  }
  return cart;
};

export const deleteCartByUserId = async (id: Types.ObjectId) => {
  const result = await cartModel.deleteOne({ user: id });
  if (result.deletedCount === 0) {
    throw new NotFoundError("Cart not found for user");
  }
};