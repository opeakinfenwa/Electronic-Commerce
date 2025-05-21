import mongoose, { Document, Schema, Model } from "mongoose";
import { hashPassword } from "../utils/authUtils";

export interface User extends Document {
  name: string;
  email: string;
  password: string;
  address: string;
  city: string;
  country: string;
  phone: number;
  profilePic: { public_id: any; url: any };
  role: "buyer" | "seller" | "admin";
  storeName: string;
}

const userSchema: Schema<User> = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "name is required"],
    },
    email: {
      type: String,
      required: [true, "email is required"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "password is required"],
    },
    address: {
      type: String,
      required: [true, "address is required"],
    },
    city: {
      type: String,
      required: [true, "city is required"],
    },
    country: {
      type: String,
      required: [true, "country is required"],
    },
    phone: {
      type: Number,
      required: [true, "phone is required"],
    },
    profilePic: {
      public_id: {
        type: String,
      },
      url: {
        type: String,
      },
    },
    role: {
      type: String,
      default: "buyer",
    },
    storeName: {
      type: String,
    },
  },
  { timestamps: true }
);

userSchema.pre<User>("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await hashPassword(this.password);
  next();
});

const userModel: Model<User> = mongoose.model<User>("User", userSchema);
export default userModel;