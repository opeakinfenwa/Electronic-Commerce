import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { BadRequestError } from "../errors/customErrors";

export const validateObjectId = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    throw new BadRequestError("Invalid Id");
  }
  next();
};