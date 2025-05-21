import Jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";
import { Request, Response, NextFunction } from "express";
import userModel from "../model/userModel";
import { UnauthorizedError, ForbiddenError } from "../errors/customErrors";

dotenv.config();

export interface CustomJwtPayload extends JwtPayload {
  id: string;
  email: string;
  role: string;
  name: string;
}

export const isAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let token =
      req.cookies?.token ||
      (req.headers.authorization?.startsWith("Bearer ")
        ? req.headers.authorization.split(" ")[1]
        : null);

    if (!token) {
      throw new UnauthorizedError("Unauthorized user");
    }
    const decoded = Jwt.verify(token, process.env.JWT_SECRET!) as CustomJwtPayload;
    const user = await userModel.findById(decoded.id);
    if (!user) {
      throw new UnauthorizedError("User not found");
    }

   req.user = {
    id: user.id.toString(),
    email: user.email,
    role: user.role,
    name: user.name,
  };
    next();
  } catch (error) {
    console.error("Error authenticating user:", error);
    next(error);
  }
};

export const isSeller = (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.user.role !== "seller") {
      throw new ForbiddenError("Access restricted to sellers only");
    }
    next();
  } catch (error) {
    console.error("Error authenticating seller:", error);
    next(error);
  }
};

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.user.role !== "admin") {
      throw new ForbiddenError("Access restricted to admins only");
    }
    next();
  } catch (error) {
    console.error("Error authenticating admin:", error);
    next(error);
  }
};