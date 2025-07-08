"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const createError_1 = require("../utils/createError");
const storage = multer_1.default.memoryStorage();
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
        cb(null, true);
    }
    else {
        cb((0, createError_1.createError)("Only image files are allowed!", 400));
    }
};
const upload = (0, multer_1.default)({ storage, fileFilter });
exports.default = upload;
//# sourceMappingURL=multer.js.map