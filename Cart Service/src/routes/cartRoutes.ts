import express from "express";
import {
  addToCartController,
  updateCartController,
  removeCartItemController,
  clearCartController,
  getCartController,
  deleteCartController,
} from "../controllers/cartController";
import { isAuth } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/add-to-cart", isAuth, addToCartController);
router.put("/update-cart", isAuth, updateCartController);
router.delete("/remove-cart-item", isAuth, removeCartItemController);
router.delete("/clear-cart", isAuth, clearCartController);
router.get("/", isAuth, getCartController);
router.delete("/", isAuth, deleteCartController);

export default router;