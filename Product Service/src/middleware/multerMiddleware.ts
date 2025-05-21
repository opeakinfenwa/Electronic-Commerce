import multer from "multer";

const storage = multer.memoryStorage();
export const singleUpload = multer({ storage }).single("file");
export const fileUpload = multer({ storage }).array("file");