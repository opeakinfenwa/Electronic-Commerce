import joi from "joi";
import { Category } from "../model/categoryModel";

export const validateCategory = (category: Category) => {
  const schema = joi.object({
    name: joi.string().max(100).required(),
  });
  return schema.validate(category);
};