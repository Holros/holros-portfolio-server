import express from "express";
import bcrypt from "bcryptjs";
import { errorResponse, successResponse } from "../../utils/serverResponse";
import { validate } from "../../middlewares/validate";
import { userSchema } from "../../schemas/userSchema";
import { prisma } from "../../utils/db";
import { z } from "zod";

const userRouter = express.Router();

userRouter.post("/create", validate(userSchema), async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    homePageAbout,
    jobTitle,
    landingPageAbout,
    resumeLink,
    password,
  } = req.body as unknown as z.infer<typeof userSchema>;

  const isUser = await prisma.user.findUnique({
    where: { email: email },
  });

  if (isUser) return errorResponse(res, "User already exists", null, 400);

  const securePassword = await bcrypt.hash(password, 12);

  const createdUser = await prisma.user.create({
    data: {
      firstName: firstName,
      lastName: lastName,
      email: email,
      homePageAbout: homePageAbout,
      jobTitle: jobTitle,
      landingPageAbout: landingPageAbout,
      resumeLink: resumeLink,
      hashedPassword: securePassword,
    },
    omit: { hashedPassword: true },
  });

  successResponse(res, "User created successfully", createdUser, 201);
});

userRouter.patch(
  "/update",
  validate(userSchema.partial()),
  async (req, res) => {
    const { id } = req.user;
    const { password, ...dataToUpdate } = req.body as unknown as z.infer<
      typeof userSchema
    >;

    const isUser = await prisma.user.findUnique({
      where: { id: id },
    });

    if (!isUser) {
      return errorResponse(res, "User does not exist", null, 404);
    }

    let securePassword: string | null = null;
    if (password) securePassword = await bcrypt.hash(password, 12);

    const updatedUser = await prisma.user.update({
      where: { id: id },
      data: {
        ...dataToUpdate,
        ...(securePassword && { hashedPassword: securePassword }),
      },
      omit: { hashedPassword: true },
    });

    successResponse(res, "User updated successfully", updatedUser, 200);
  }
);

export default userRouter;
