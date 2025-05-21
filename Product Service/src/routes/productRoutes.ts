import express from "express";
import {
  createProductController,
  updateProductController,
  deleteProductController,
  uploadProductImageController,
  updateProductImageController,
  deleteProductImageController,
  addProductReviewController,
  getProductController,
} from "../controllers/productController";
import { isAuth, isSeller, isAdmin } from "../middleware/authMiddleware";
import { fileUpload } from "../middleware/multerMiddleware";

const router = express.Router();

router.post("/create-product", isAuth, isSeller, createProductController);
router.put("/update-product/:id", isAuth, isSeller, updateProductController);
router.delete("/delete-product/:id", isAuth, isSeller, isAdmin, deleteProductController);
router.post("/upload-productimage/:id", isAuth, uploadProductImageController, fileUpload);
router.put("/update-productimage/:id", isAuth, updateProductImageController, fileUpload);
router.delete("/delete-productimage/:id", isAuth, deleteProductImageController);
router.post("/product-review", isAuth, addProductReviewController);
router.get("/:id", isAuth, getProductController);

export default router;