import userModel, { User } from "../model/userModel";
import { validateUser } from "../validations/userValidation";
import {
  BadRequestError,
  ConflictError,
  ForbiddenError,
  NotFoundError,
} from "../errors/customErrors";
import { getDataUri } from "../utils/fileUtils";
import cloudinary from "cloudinary";

interface LoggedInUser {
  id: string;
  role: string;
}

export const signupService = async (userData: User) => {
  const { error } = validateUser(userData);
  if (error) throw new BadRequestError(error.details[0].message);

  const existingUser = await userModel.findOne({ email: userData.email });
  if (existingUser) throw new ConflictError("User already exists");

  const newUser = await userModel.create(userData);
  return newUser;
};

export const updateUserService = async (
  userId: string,
  userData: Partial<User>
) => {
  const user = await userModel.findByIdAndUpdate(userId, userData, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    throw new BadRequestError("User not found");
  }

  return user;
};

export const deleteUserService = async (id: string, loggedInUser: LoggedInUser) => {
  const user = await userModel.findById(id);
  if (!user) {
    throw new NotFoundError("User not found");
  }

  if (user.id !== loggedInUser.id && loggedInUser.role !== "admin") {
    throw new ForbiddenError("You don't have permission to delete this user");
  }

  await user.deleteOne();
};

export const getSingleUserService = async (userId: string) => {
  const user = await userModel.findById(userId).select("-password");
  if (!user) {
    throw new NotFoundError("User not found");
  }
  return user;
};

export const getAllUserService = async () => {
  const users = await userModel.find().sort("_id");
  if (!users) {
    throw new NotFoundError("Users not found");
  }
  return users;
};

export const uploadProfilePicService = async (
  userId: string,
  file: Express.Multer.File | undefined
) => {
  if (!file) {
    throw new BadRequestError("No file uploaded");
  }

  const user = await userModel.findById(userId);
  if (!user) {
    throw new NotFoundError("User not found");
  }

  const fileUri = getDataUri(file);
  const cloudUpload = await cloudinary.v2.uploader.upload(fileUri.content!);

  user.profilePic = {
    public_id: cloudUpload.public_id,
    url: cloudUpload.secure_url,
  };

  await user.save();
};

export const updateProfilePicService = async (
  userId: string,
  file: Express.Multer.File | undefined
) => {
  if (!file) {
    throw new BadRequestError("No file uploaded");
  }

  const user = await userModel.findById(userId);
  if (!user) {
    throw new NotFoundError("User not found");
  }

  if (user.profilePic?.public_id) {
    await cloudinary.v2.uploader.destroy(user.profilePic.public_id);
  }

  const fileUri = getDataUri(file);
  const cloudUpload = await cloudinary.v2.uploader.upload(fileUri.content!);

  user.profilePic = {
    public_id: cloudUpload.public_id,
    url: cloudUpload.secure_url,
  };

  await user.save();
};

export const deleteProfilePicService = async (userId: string) => {
  const user = await userModel.findById(userId);
  if (!user) {
    throw new NotFoundError("User not found");
  }

  if (user.profilePic?.public_id) {
    await cloudinary.v2.uploader.destroy(user.profilePic.public_id);
    user.profilePic = { public_id: "", url: "" };
    await user.save();
  }
};