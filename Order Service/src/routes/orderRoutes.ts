import express from "express";
import {
  createOrderController,
  getOrderDetailsController,
  getUserOrdersController,
} from "../controller/orderControllers";
import { isAuth, isAdmin } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/create-order", isAuth, createOrderController);
router.get("/:orderId", isAuth, isAdmin, getOrderDetailsController);
router.get("/", isAuth, getUserOrdersController);

export default router;