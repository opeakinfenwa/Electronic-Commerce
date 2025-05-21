import { z } from "zod";
import { PaymentMethod } from "../model/orderModel";

export const CreateOrderSchema = z.object({
  address: z.object(
    {
      street: z
        .string({ required_error: "Street is required" })
        .min(1, "Street cannot be empty"),
      city: z
        .string({ required_error: "City is required" })
        .min(1, "City cannot be empty"),
      state: z
        .string({ required_error: "State is required" })
        .min(1, "State cannot be empty"),
      zipCode: z
        .string({ required_error: "Zip code is required" })
        .min(1, "Zip code cannot be empty"),
      country: z
        .string({ required_error: "Country is required" })
        .min(1, "Country cannot be empty"),
    },
    { required_error: "Address is required" }
  ),

  paymentMethod: z.nativeEnum(PaymentMethod, {
    required_error: "Payment method is required",
    invalid_type_error: "Invalid payment method",
  }),
});