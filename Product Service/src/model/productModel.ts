import mongoose, { Schema, model, Document, Types } from "mongoose";

export interface Review {
  user: Types.ObjectId;
  name: string;
  rating: number;
  comment: string;
}

export interface Product extends Document {
  name: string;
  userId: Types.ObjectId;
  description: string;
  price: number;
  category: Types.ObjectId;
  brand: string;
  stock: number;
  reviews: Review[];
  images: [any];
  averageRating: number;
  numReviews: number;
}

const ReviewSchema: Schema<Review> = new mongoose.Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
    },
  },
  { timestamps: true, _id: false }
);

const ProductSchema: Schema<Product> = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    category: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    brand: {
      type: String,
      required: true,
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
    },
    reviews: [ReviewSchema],
    images: [
      {
        public_id: String,
        url: String,
      },
    ],
    averageRating: {
      type: Number,
      default: 0,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

ProductSchema.methods.calculateAverageRating = function () {
  if (this.reviews.length > 0) {
    const totalRating = this.reviews.reduce(
      (sum: any, review: any) => sum + review.rating,
      0
    );
    this.averageRating = totalRating / this.reviews.length;
    this.numReviews = this.reviews.length;
  } else {
    this.averageRating = 0;
    this.numReviews = 0;
  }
};

const productModel = model<Product>("Product", ProductSchema);
export default productModel;