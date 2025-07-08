"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadImageToCloud = uploadImageToCloud;
const cloudinary_1 = require("cloudinary");
const createError_1 = require("./createError");
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
async function uploadImageToCloud(buffer) {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary_1.v2.uploader.upload_stream((error, result) => {
            if (error)
                return reject(error);
            if (!result?.secure_url)
                return reject((0, createError_1.createError)("Image upload failed", 500));
            resolve(result.secure_url);
        });
        uploadStream.end(buffer);
    });
}
//# sourceMappingURL=uploadImageToCloud.js.map