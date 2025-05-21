import express from "express";
import {
  getPaymentByIdController,
  getPaymentsByUserController,
} from "../controllers/paymentControllers";
import { isAuth, isAdmin } from "../middleware/authMiddleware";

const router = express.Router();

router.get("/:paymentId", isAuth, isAdmin, getPaymentByIdController);
router.get("/", isAuth, getPaymentsByUserController);

export default router;