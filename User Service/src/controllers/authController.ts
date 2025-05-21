import { Request, Response, NextFunction } from "express";
import {
  loginService,
  passwordResetService,
  changePasswordService,
} from "../services/authService";

export const loginController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;
    const { user, token } = await loginService(email, password);

    res
      .setHeader("Authorization", `Bearer ${token}`)
      .cookie("token", token, {
        expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        sameSite: true,
      })
      .status(200)
      .json({
        success: true,
        message: "Login successful",
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
        },
      });
  } catch (error) {
    console.error("Error login in user:", error);
    next(error);
  }
};

export const logoutController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    res
      .status(200)
      .cookie("token", "", {
        expires: new Date(Date.now()),
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        sameSite: true,
      })
      .setHeader("Authorization", "")
      .json({
        success: true,
        message: "Logout successfully",
      });
  } catch (error) {
    console.error("Error login out user:", error);
    next(error);
  }
};

export const passwordResetController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, newPassword } = req.body;
    await passwordResetService(email, newPassword);

    res.status(200).json({
      success: true,
      message: "Your password has been successfully reset. Please login.",
    });
  } catch (error) {
    console.error("Error reseting password:", error);
    next(error);
  }
};

export const changePasswordController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { oldPassword, newPassword } = req.body;
    await changePasswordService(req.user.id, oldPassword, newPassword);

    res.status(200).json({
      success: true,
      message: "Password successfully changed",
    });
  } catch (error) {
    console.error("Error changing password:", error);
    next(error);
  }
};