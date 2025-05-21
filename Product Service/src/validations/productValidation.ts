import joi from "joi";
import { Product, Review } from "../model/productModel";

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

export const validateProduct = (product: Product) => {
  const schema = joi.object({
    name: joi.string().max(100).required(),
    userId: joi.string().pattern(objectIdRegex, "ObjectId").required(),
    description: joi.string().max(100).required(),
    price: joi.number().required(),
    category: joi.string().pattern(objectIdRegex, "ObjectId").required(),
    brand: joi.string().max(100).required(),
    stock: joi.number().required(),
    averageRating: joi.number(),
    numReviews: joi.number(),
  });
  return schema.validate(product);
};

export const validateReview = (review: Review) => {
  const schema = joi.object({
    user: joi.string().pattern(objectIdRegex, "ObjectId").required(),
    name: joi.string().max(100).required(),
    rating: joi.number().required(),
    comment: joi.number().required(),
  });
  return schema.validate(review);
};