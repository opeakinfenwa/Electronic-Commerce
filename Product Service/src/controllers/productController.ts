import {
  createProductService,
  updateProductService,
  deleteProductService,
  getProductService,
  uploadProductImagesService,
  updateProductImagesService,
  deleteProductImageService,
  addProductReviewService,
} from "../services/productService";
import { Request, Response, NextFunction } from "express";

export const createProductController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const productData = {
      ...req.body,
      userId: req.user.id,
    };
    await createProductService(productData);

    res.status(201).json({
      success: true,
      message: "Product created succesfully",
      productData,
    });
  } catch (error) {
    console.error("Error creating product:", error);
    next(error);
  }
};

export const updateProductController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const updateData = req.body;
    await updateProductService(userId, id, updateData);

    res.status(200).json({
      success: true,
      message: "Product updated successfuly",
      updateData,
    });
  } catch (error) {
    console.error("Error updating product:", error);
    next(error);
  }
};

export const deleteProductController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    await deleteProductService(userId, id);

    res.status(200).json({
      success: true,
      message: "Product deleted successfuly",
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    next(error);
  }
};

export const getProductController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    const product = await getProductService(id, userId, userRole);

    res.status(200).json({
      success: true,
      message: "Product details fetched successfully",
      product,
    });
  } catch (error) {
    console.error("Error fetching product details:", error);
    next(error);
  }
};

export const uploadProductImageController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const files = req.files as Express.Multer.File[];

    const uploadedImages = await uploadProductImagesService(userId, id, files);

    res.status(200).json({
      success: true,
      message: "Product images uploaded successfully",
      images: uploadedImages,
    });
  } catch (error) {
    console.error("Error uploading product images:", error);
    next(error);
  }
};

export const updateProductImageController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const files = req.files as Express.Multer.File[];

    const uploadedImages = await updateProductImagesService(userId, id, files);

    res.status(200).json({
      success: true,
      message: "Product image updated successfully",
      images: uploadedImages,
    });
  } catch (error) {
    console.error("Error updating product image:", error);
    next(error);
  }
};

export const deleteProductImageController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user.id;
    const { _id } = req.params;
    const { id } = req.query as { id: string };

    await deleteProductImageService(userId, _id, id);

    res.status(200).json({
      success: true,
      message: "Product image deleted successfuly",
    });
  } catch (error) {
    console.error("Error deleting product image:", error);
    next(error);
  }
};

export const addProductReviewController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { rating, comment } = req.body;
    const { id } = req.params;

    await addProductReviewService(
      id,
      req.user.id,
      req.user.name,
      rating,
      comment
    );

    res.status(201).json({
      success: true,
      message: "Product review added successfully",
    });
  } catch (error) {
    console.error("Error adding product review:", error);
    next(error);
  }
};