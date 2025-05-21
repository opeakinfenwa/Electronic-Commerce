import { NextFunction, Request, Response } from "express";
import {
  createCategoryService,
  updateCategoryService,
  deleteCategoryService,
} from "../services/categoryService";

export const createCategoryController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name } = req.body;
    await createCategoryService(name);
    res.status(201).json({
      success: true,
      message: `${name} Category created successfully`,
    });
  } catch (error) {
    console.error("Error creating category:", error);
    next(error);
  }
};

export const updateCategoryController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name } = req.body;
    const { id } = req.params;

    const updatedCategory = await updateCategoryService(id, name);

    res.status(200).json({
      success: true,
      message: "Category updated successfully",
      category: updatedCategory,
    });
  } catch (error) {
    console.error("Error updating category:", error);
    next(error);
  }
};

export const deleteCategoryController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await deleteCategoryService(req.params.id);
    res.status(200).json({
      success: true,
      message: "category deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting category:", error);
    next(error);
  }
};