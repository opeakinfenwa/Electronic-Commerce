import mongoose, { Schema, Document, Types } from "mongoose";

export interface CartItem {
  product: Types.ObjectId;
  name: string;
  price: number;
  quantity: number;
  totalPrice: number;
}

export interface CartDocument extends Document {
  user: mongoose.Schema.Types.ObjectId;
  items: CartItem[];
  totalQuantity: number;
  totalPrice: number;
}

const CartItemSchema = new Schema<CartItem>({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
});

const CartSchema = new Schema<CartDocument>({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  items: [CartItemSchema],
  totalQuantity: {
    type: Number,
    default: 0,
  },
  totalPrice: {
    type: Number,
    default: 0,
  },
});

const cartModel = mongoose.model<CartDocument>("Cart", CartSchema);
export default cartModel;