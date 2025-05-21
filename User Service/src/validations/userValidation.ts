import Joi from "joi";
import { User } from "../model/userModel";

export const validateUser = (user: User) => {
  const schema = Joi.object({
    name: Joi.string().max(50).required(),
    email: Joi.string().email().max(100).required(),
    password: Joi.string().min(5).max(100).required(),
    address: Joi.string().max(100).required(),
    city: Joi.string().max(100).required(),
    country: Joi.string().max(100).required(),
    phone: Joi.number().required(),
    role: Joi.string().valid("buyer", "seller", "admin").required(),
    storeName: Joi.string().when("role", {
      is: "seller",
      then: Joi.string().required(),
      otherwise: Joi.forbidden(),
    }),
  });

  return schema.validate(user);
};

export const validateLogin = (userData: {
  email: string;
  password: string;
}) => {
  const schema = Joi.object({
    email: Joi.string().email().max(100).required(),
    password: Joi.string().min(5).max(100).required(),
  });

  return schema.validate(userData);
};