import express from "express";
import { prisma } from "../../utils/db";
import { errorResponse, successResponse } from "../../utils/serverResponse";
import { uploadImageToCloud } from "../../utils/uploadImageToCloud";
import { validate } from "../../middlewares/validate";
import { idSchema } from "../../schemas/idSchema";
import {
  partialProjectSchema,
  projectSchema,
} from "../../schemas/projectSchema";
import { normalizeFormData } from "../../middlewares/normalizeFormData";
import upload from "../../middlewares/multer";
import { z } from "zod";

const projectRouter = express.Router();

projectRouter.post(
  "/create",
  // multer middleware to handle file uploads
  upload.single("projectPicture"),
  normalizeFormData(["isMobileApp"], ["skills"]),
  validate(projectSchema),
  async (req, res) => {
    const {
      isMobileApp,
      projectName,
      githubLink = null,
      liveLink = null,
      androidLink = null,
      iosLink = null,
      skills,
    } = req.body as unknown as z.infer<typeof projectSchema>;

    // Check if the file is provided
    const file = req.file;
    if (!file) {
      return errorResponse(res, "Project picture is required", null, 400);
    }

    const projectPictureUrl = await uploadImageToCloud(file.buffer);

    const userId = req.user.id;

    const addedProject = await prisma.project.create({
      data: {
        projectPicture: projectPictureUrl,
        isMobileApp: isMobileApp,
        projectName: projectName,
        githubLink: githubLink,
        liveLink: liveLink,
        androidLink: androidLink,
        iosLink: iosLink,
        userId,
        skills: {
          connect: skills.map((skill: { shortName: string }) => ({
            shortName: skill.shortName,
          })),
        },
      },
      include: {
        skills: true,
      },
    });

    successResponse(res, "Project created successfully", addedProject, 201);
  }
);

projectRouter.patch(
  "/update/:id",
  upload.single("projectPicture"),
  normalizeFormData(["isMobileApp"], ["skills"]),
  validate(partialProjectSchema),
  validate(idSchema, "params"),
  async (req, res) => {
    const { id } = req.params as unknown as z.infer<typeof idSchema>;
    const {
      isMobileApp,
      projectName,
      githubLink,
      liveLink,
      androidLink,
      iosLink,
      skills,
    } = req.body as unknown as z.infer<typeof partialProjectSchema>;

    const existingProject = await prisma.project.findUnique({ where: { id } });

    if (!existingProject) {
      return errorResponse(res, "Project not found", null, 404);
    }

    let projectPictureUrl: string | undefined;
    if (req.file) {
      projectPictureUrl = await uploadImageToCloud(req.file.buffer);
    }

    // Prepare update data
    const updateData = {
      ...(isMobileApp !== undefined && { isMobileApp }),
      ...(projectName && { projectName }),
      ...(githubLink !== undefined && { githubLink }),
      ...(liveLink !== undefined && { liveLink }),
      ...(androidLink !== undefined && { androidLink }),
      ...(iosLink !== undefined && { iosLink }),
      ...(projectPictureUrl && { projectPicture: projectPictureUrl }),
    };

    // Update project
    const updatedProject = await prisma.project.update({
      where: { id },
      data: {
        ...updateData,
        ...(skills &&
          skills.length > 0 && {
            skills: {
              set: [], // Clear existing
              connect: skills.map((skill: { shortName: string }) => ({
                shortName: skill.shortName,
              })),
            },
          }),
      },
      include: {
        skills: true,
      },
    });

    successResponse(res, "Project updated successfully", updatedProject, 200);
  }
);

projectRouter.delete(
  "/delete/:id",
  validate(idSchema, "params"),
  async (req, res) => {
    const { id } = req.params as unknown as z.infer<typeof idSchema>;

    const existingProject = await prisma.project.findUnique({
      where: { id },
    });

    if (!existingProject)
      return errorResponse(res, "Project not found", null, 404);

    await prisma.project.delete({ where: { id: id } });

    successResponse(res, "Project deleted successfully", null, 200);
  }
);

export default projectRouter;
