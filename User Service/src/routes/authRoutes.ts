import express from "express";
import {
  loginController,
  logoutController,
  passwordResetController,
  changePasswordController,
} from "../controllers/authController";
import { isAuth } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/login", loginController);
router.post("/logout", isAuth, logoutController);
router.post("/reset-password", passwordResetController);
router.put("/change-password", isAuth, changePasswordController);

export default router;