import DataURIParser from "datauri/parser";
import { DataURI } from "datauri/types";
import path from "path";

export const getDataUri = (file: {
  originalname: string;
  buffer: DataURI.Input;
}) => {
  const parser = new DataURIParser();
  const extName = path.extname(file.originalname).toString();
  return parser.format(extName, file.buffer);
};

export const getDataUris = (
  files: { originalname: string; buffer: DataURI.Input }[]
) => {
  const parser = new DataURIParser();
  return files.map((file) => {
    const extName = path.extname(file.originalname).toString();
    return parser.format(extName, file.buffer);
  });
};