import bcrypt from "bcrypt";
import JWT from "jsonwebtoken";
import dotenv from "dotenv";
import { User } from "../model/userModel";

dotenv.config();

export const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, 10);
};

export const comparePassword = async (
  enteredPassword: string,
  storedPassword: string
): Promise<boolean> => {
  return await bcrypt.compare(enteredPassword, storedPassword);
};

export const generateAuthToken = (user: User): string => {
  return JWT.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role,
      name: user.name,
    },
    process.env.JWT_SECRET as string,
    { expiresIn: "7d" }
  );
};