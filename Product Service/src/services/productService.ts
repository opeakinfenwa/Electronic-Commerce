import productModel, { Product, Review } from "../model/productModel";
import { validateProduct } from "../validations/productValidation";
import cloudinary from "cloudinary";
import { getDataUris } from "../utils/fileUtils";
import {
  BadRequestError,
  NotFoundError,
  ForbiddenError,
} from "../errors/customErrors";
import mongoose from "mongoose";

interface ProductItem {
  productId: string;
  quantity: number;
}

export const createProductService = async (productData: Product) => {
  const { error } = validateProduct(productData);
  if (error) {
    throw new BadRequestError(error.details[0].message);
  }

  const product = await productModel.create(productData);
  return product;
};

export const updateProductService = async (
  userId: string,
  id: string,
  updateData: Partial<Product>
) => {
  const product = await productModel.findById(id);
  if (!product) {
    throw new NotFoundError("Product not found");
  }

  if (product.userId.toString() !== userId) {
    throw new ForbiddenError("You are not authorized to update this product");
  }

  Object.assign(product, updateData);

  await product.save();
};

export const deleteProductService = async (userId: string, id: string) => {
  const product = await productModel.findById(id);
  if (!product) {
    throw new NotFoundError("Product not found");
  }

  if (product.userId.toString() !== userId) {
    throw new ForbiddenError("You are not authorized to delete this product");
  }

  await Promise.all(
    product.images.map((image) =>
      cloudinary.v2.uploader.destroy(image.public_id)
    )
  );

  await product.deleteOne();
};

export const getProductService = async (
  id: string,
  userId: string,
  userRole: string
) => {
  const product = await productModel.findById(id);
  if (!product) {
    throw new NotFoundError("Product not found");
  }

  if (product.userId.toString() !== userId && userRole !== "admin") {
    throw new ForbiddenError("Access denied. Not your product.");
  }

  return product;
};

export const uploadProductImagesService = async (
  userId: string,
  id: string,
  files: Express.Multer.File[]
) => {
  const product = await productModel.findById(id);
  if (!product) {
    throw new NotFoundError("Product not found");
  }

  if (product.userId.toString() !== userId) {
    throw new ForbiddenError(
      "You are not authorized to upload these product images"
    );
  }

  if (!files || !Array.isArray(files) || files.length === 0) {
    throw new BadRequestError("No files uploaded");
  }

  const filesDataUri = getDataUris(files);

  const uploadPromises = filesDataUri.map((file) =>
    cloudinary.v2.uploader.upload(file.content!)
  );

  const uploadedImages = await Promise.all(uploadPromises);

  uploadedImages.forEach((cdb) => {
    product.images.push({
      public_id: cdb.public_id,
      url: cdb.secure_url,
    });
  });

  await product.save();

  return uploadedImages;
};

export const updateProductImagesService = async (
  userId: string,
  id: string,
  files: Express.Multer.File[]
) => {
  const product = await productModel.findById(id);
  if (!product) {
    throw new NotFoundError("Product not found");
  }

  if (product.userId.toString() !== userId) {
    throw new ForbiddenError(
      "You are not authorized to update these product images"
    );
  }

  if (!files || files.length === 0) {
    throw new BadRequestError("No image files uploaded");
  }

  const filesDataUri = getDataUris(files);

  const validFiles = filesDataUri.filter((file) => file?.content);
  if (validFiles.length === 0) {
    throw new BadRequestError("Failed to process image files");
  }

  const uploadedImages = await Promise.all(
    validFiles.map((file) => cloudinary.v2.uploader.upload(file.content!))
  );

  uploadedImages.forEach((cdb) => {
    product.images.push({
      public_id: cdb.public_id,
      url: cdb.secure_url,
    });
  });

  await product.save();

  return uploadedImages;
};

export const deleteProductImageService = async (
  userId: string,
  productId: string,
  imageId: string
) => {
  const product = await productModel.findById(productId);
  if (!product) {
    throw new NotFoundError("Product not found");
  }

  if (product.userId.toString() !== userId) {
    throw new ForbiddenError(
      "You are not authorized to delete the product images"
    );
  }

  if (!imageId) {
    throw new BadRequestError("Product image ID is required");
  }

  const imageIndex = product.images.findIndex(
    (item) => item._id.toString() === imageId.toString()
  );

  if (imageIndex === -1) {
    throw new NotFoundError("Image not found");
  }

  await cloudinary.v2.uploader.destroy(product.images[imageIndex].public_id);
  product.images.splice(imageIndex, 1);
  await product.save();
};

export const addProductReviewService = async (
  productId: string,
  userId: string,
  userName: string,
  rating: number,
  comment: string
) => {
  const product = await productModel.findById(productId);
  if (!product) {
    throw new NotFoundError("Product not found");
  }

  const alreadyReviewed = product.reviews.some(
    (review) => review.user.toString() === userId
  );
  if (alreadyReviewed) {
    throw new BadRequestError("Product already reviewed");
  }
  const objectUserId = new mongoose.Types.ObjectId(userId);
  const review: Review = {
    user: objectUserId,
    name: userName,
    rating: Number(rating),
    comment,
  };

  product.reviews.push(review);
  product.numReviews = product.reviews.length;
  await product.save();
};

export const updateProductStock = async (items: ProductItem[]) => {
  for (const item of items) {
    await productModel.updateOne(
      { _id: item.productId },
      { $inc: { stock: -item.quantity } }
    );
  }
};