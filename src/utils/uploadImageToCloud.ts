import { v2 as cloudinary } from "cloudinary";
import { createError } from "./createError";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function uploadImageToCloud(buffer: Buffer): Promise<string> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream((error, result) => {
      if (error) return reject(error);
      if (!result?.secure_url)
        return reject(createError("Image upload failed", 500));
      resolve(result.secure_url);
    });

    uploadStream.end(buffer);
  });
}
