import mongoose from "mongoose";
import { Request, Response, NextFunction } from "express";

module.exports = function (req: Request, res: Response, next: NextFunction) {
  if (!mongoose.Types.ObjectId.isValid(req.params._id)) {
    return res.status(404).json({
      success: false,
      message: "Invalid Id",
    });
  }
  next();
};