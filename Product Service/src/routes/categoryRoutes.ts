import express from "express";
import {
  createCategoryController,
  updateCategoryController,
  deleteCategoryController,
} from "../controllers/categoryController";
import { isAuth, isAdmin } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/create-category", isAuth, isAdmin, createCategoryController);
router.put("/update-category", isAuth, isAdmin, updateCategoryController);
router.delete("/delete-category", isAuth, isAdmin, deleteCategoryController);

export default router;