import express from "express";
import upload from "../../middlewares/multer";
import { validate } from "../../middlewares/validate";
import { idSchema } from "../../schemas/idSchema";
import { testimonialSchema } from "../../schemas/testimonialSchema";
import { prisma } from "../../utils/db";
import { errorResponse, successResponse } from "../../utils/serverResponse";
import { uploadImageToCloud } from "../../utils/uploadImageToCloud";
import { z } from "zod";

const testimonialRouter = express.Router();

testimonialRouter.post(
  "/create",
  // multer middleware to handle file uploads
  upload.single("profilePicture"),
  validate(testimonialSchema),
  async (req, res) => {
    const { firstName, lastName, testimonial } = req.body as unknown as z.infer<
      typeof testimonialSchema
    >;

    // Check if the file is provided
    const file = req.file;
    if (!file) {
      return errorResponse(res, "Profile picture is required", null, 400);
    }

    const profilePictureUrl = await uploadImageToCloud(file.buffer);

    const userId = req.user.id;

    const addedTestimonial = await prisma.testimonial.create({
      data: {
        firstName: firstName,
        lastName: lastName,
        profilePicture: profilePictureUrl,
        testimonial: testimonial,
        userId,
      },
    });

    successResponse(
      res,
      "Testimonial created successfully",
      addedTestimonial,
      201
    );
  }
);

testimonialRouter.patch(
  "/update/:id",
  upload.single("profilePicture"),
  validate(testimonialSchema.partial()),
  validate(idSchema, "params"),
  async (req, res) => {
    const dataToUpdate = req.body as unknown as z.infer<
      typeof testimonialSchema
    >;
    const { id } = req.params as unknown as z.infer<typeof idSchema>;

    // Check if the testimonial exists
    const isTestimonial = await prisma.testimonial.findUnique({
      where: { id: id },
    });

    if (!isTestimonial) {
      return errorResponse(res, "Testimonial does not exist", null, 404);
    }

    // Check if the file is provided
    const file = req.file;
    let profilePictureUrl: string | null = null;
    if (file) {
      profilePictureUrl = await uploadImageToCloud(file.buffer);
    }

    // Update the testimonial
    const updatedTestimonial = await prisma.testimonial.update({
      where: { id: id },
      data: {
        ...dataToUpdate,
        ...(profilePictureUrl && { profilePicture: profilePictureUrl }),
      },
    });

    successResponse(
      res,
      "Testimonial updated successfully",
      updatedTestimonial,
      200
    );
  }
);

testimonialRouter.delete(
  "/delete/:id",
  validate(idSchema, "params"),
  async (req, res) => {
    const { id } = req.params as unknown as z.infer<typeof idSchema>;

    const existingProject = await prisma.testimonial.findUnique({
      where: { id },
    });

    if (!existingProject)
      return errorResponse(res, "Testimonial not found", null, 404);

    await prisma.project.delete({ where: { id: id } });

    successResponse(res, "Testimonial deleted successfully", null, 200);
  }
);

export default testimonialRouter;
