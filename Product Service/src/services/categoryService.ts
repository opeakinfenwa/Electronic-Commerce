import { BadRequestError, NotFoundError } from "../errors/customErrors";
import categoryModel, { Category } from "../model/categoryModel";
import productModel from "../model/productModel";
import { validateCategory } from "../validations/categoryValidation";

export const createCategoryService = async (categoryData: Category) => {
  const { error } = validateCategory(categoryData);
  if (error) throw new BadRequestError(error.details[0].message);

  return await categoryModel.create({ categoryData });
};

export const updateCategoryService = async (id: string, name: string) => {
  const category = await categoryModel.findById(id);
  if (!category) {
    throw new NotFoundError("Category not found");
  }

  const oldCategoryName = category.name;
  category.name = name;
  await category.save();

  await productModel.updateMany(
    { category: oldCategoryName },
    { $set: { category: name } }
  );
  return category;
};

export const deleteCategoryService = async (id: string) => {
  const category = await categoryModel.findById(id);
  if (!category) {
    throw new NotFoundError("Category not found");
  }

  const categoryName = category.name;
  await category.deleteOne();

  await productModel.updateMany(
    { category: categoryName },
    { $set: { category: "Uncategorized" } }
  );
};
