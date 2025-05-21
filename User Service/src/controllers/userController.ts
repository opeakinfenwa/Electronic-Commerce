import { Request, Response, NextFunction } from "express";
import {
  signupService,
  updateUserService,
  deleteUserService,
  getSingleUserService,
  getAllUserService,
  uploadProfilePicService,
  updateProfilePicService,
  deleteProfilePicService,
} from "../services/userService";

export const signupController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = await signupService(req.body);
    res.status(201).json({
      success: true,
      message: "User signup successful",
      user,
    });
  } catch (error) {
    console.error("Error signing up user:", error);
    next(error);
  }
};

export const updateUserController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const updatedUser = await updateUserService(req.user.id, req.body);

    res.status(200).json({
      success: true,
      message: "User profile updated",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    next(error);
  }
};

export const deleteUserController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await deleteUserService(req.params.id, req.user);
    res.status(200).json({
      status: true,
      message: " User succesfully deleted",
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    next(error);
  }
};

export const getSingleUserController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = await getSingleUserService(req.user.id);
    res.status(200).json({
      status: true,
      message: " User details successfully fetched",
      user,
    });
  } catch (error) {
    console.error("Error fetching user details:", error);
    next(error);
  }
};

export const getAllUsersController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const users = await getAllUserService();
    res.status(200).json({
      status: true,
      message: " User details successfully fetched",
      users,
    });
  } catch (error) {
    console.error("Error Fetching Users Detail:", error);
    next(error);
  }
};

export const uploadProfilePicController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await uploadProfilePicService(req.user.id, req.file);
    res.status(200).json({
      success: true,
      message: "Profile Picture uploaded successfully",
    });
  } catch (error) {
    console.error("Error uploading profile picture:", error);
    next(error);
  }
};

export const updateProfilePicController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await updateProfilePicService(req.user.id, req.file);
    res.status(200).json({
      success: true,
      message: "Profile Picture updated successfully",
    });
  } catch (error) {
    console.error("Error updating profile picture:", error);
    next(error);
  }
};

export const deleteProfilePicController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await deleteProfilePicService(req.user.id);
    res.status(200).json({
      success: true,
      message: "Profile picture deleted usccessfully",
    });
  } catch (error) {
    console.error("Error deleting Profile Picture:", error);
    next(error);
  }
};