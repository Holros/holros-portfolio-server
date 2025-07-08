"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("../../middlewares/multer"));
const validate_1 = require("../../middlewares/validate");
const idSchema_1 = require("../../schemas/idSchema");
const testimonialSchema_1 = require("../../schemas/testimonialSchema");
const db_1 = require("../../utils/db");
const serverResponse_1 = require("../../utils/serverResponse");
const uploadImageToCloud_1 = require("../../utils/uploadImageToCloud");
const testimonialRouter = express_1.default.Router();
testimonialRouter.post("/create", multer_1.default.single("profilePicture"), (0, validate_1.validate)(testimonialSchema_1.testimonialSchema), async (req, res) => {
    const { firstName, lastName, testimonial } = req.body;
    const file = req.file;
    if (!file) {
        return (0, serverResponse_1.errorResponse)(res, "Profile picture is required", null, 400);
    }
    const profilePictureUrl = await (0, uploadImageToCloud_1.uploadImageToCloud)(file.buffer);
    const user = await db_1.prisma.user.findFirst({
        where: {
            email: { equals: process.env.MY_EMAIL, mode: "insensitive" },
        },
    });
    const addedTestimonial = await db_1.prisma.testimonial.create({
        data: {
            firstName: firstName,
            lastName: lastName,
            profilePicture: profilePictureUrl,
            testimonial: testimonial,
            userId: user?.id,
        },
    });
    (0, serverResponse_1.successResponse)(res, "Testimonial created successfully", addedTestimonial, 201);
});
testimonialRouter.patch("/update/:id", multer_1.default.single("profilePicture"), (0, validate_1.validate)(testimonialSchema_1.testimonialSchema.partial()), (0, validate_1.validate)(idSchema_1.idSchema, "params"), async (req, res) => {
    const dataToUpdate = req.body;
    const { id } = req.params;
    const isTestimonial = await db_1.prisma.testimonial.findUnique({
        where: { id: id },
    });
    if (!isTestimonial) {
        return (0, serverResponse_1.errorResponse)(res, "Testimonial does not exist", null, 404);
    }
    const file = req.file;
    let profilePictureUrl = null;
    if (file) {
        profilePictureUrl = await (0, uploadImageToCloud_1.uploadImageToCloud)(file.buffer);
    }
    const updatedTestimonial = await db_1.prisma.testimonial.update({
        where: { id: id },
        data: {
            ...dataToUpdate,
            ...(profilePictureUrl && { profilePicture: profilePictureUrl }),
        },
    });
    (0, serverResponse_1.successResponse)(res, "Testimonial updated successfully", updatedTestimonial, 200);
});
exports.default = testimonialRouter;
//# sourceMappingURL=testimonialRouter.js.map