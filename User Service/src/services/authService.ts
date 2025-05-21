import bcrypt from "bcrypt";
import userModel from "../model/userModel";
import {
  BadRequestError,
  UnauthorizedError,
  NotFoundError,
} from "../errors/customErrors";
import { generateAuthToken, comparePassword } from "../utils/authUtils";
import { validateLogin } from "../validations/userValidation";

export const loginService = async (email: string, password: string) => {
  const { error } = validateLogin({ email, password });
  if (error) throw new BadRequestError(error.details[0].message);

  const user = await userModel.findOne({ email });
  if (!user) {
    throw new BadRequestError("Invalid email");
  }

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    throw new UnauthorizedError("Invalid password");
  }

  const token = generateAuthToken(user);
  return { user, token};
};

export const passwordResetService = async (
  email: string,
  newPassword: string
) => {
  if (!email || !newPassword) {
    throw new BadRequestError("Please provide email and new password");
  }

  const user = await userModel.findOne({ email });
  if (!user) {
    throw new NotFoundError("Invalid user");
  }

  user.password = newPassword;
  await user.save();
};

export const changePasswordService = async (
  userId: string,
  oldPassword: string,
  newPassword: string
) => {
  if (!oldPassword || !newPassword) {
    throw new BadRequestError("Please provide old and new passwords");
  }

  const user = await userModel.findById(userId);
  if (!user) {
    throw new NotFoundError("User not Found");
  }

  const isMatch = await comparePassword(oldPassword, user.password);
  if (!isMatch) {
    throw new BadRequestError("Invalid password");
  }

  user.password = newPassword;
  await user.save();
};