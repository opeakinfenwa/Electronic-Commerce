import mongoose, { Document, Schema, Model } from "mongoose";

export interface Category extends Document {
  name: string;
}

const categorySchema: Schema<Category> = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const categoryModel: Model<Category> = mongoose.model(
  "Category",
  categorySchema
);
export default categoryModel;