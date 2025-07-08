import multer, { FileFilterCallback } from "multer";
import { Request } from "express";
import { createError } from "../utils/createError";

// Store files in memory
const storage = multer.memoryStorage();

// Accept only image files
const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true); // Accept
  } else {
    cb(createError("Only image files are allowed!", 400)); // Reject
  }
};

const upload = multer({ storage, fileFilter });

export default upload;
