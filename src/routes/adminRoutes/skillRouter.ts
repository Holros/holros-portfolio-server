import express from "express";
import { prisma } from "../../utils/db";
import { skillSchema } from "../../schemas/skillSchema";
import { errorResponse, successResponse } from "../../utils/serverResponse";
import { validate } from "../../middlewares/validate";
import { z } from "zod";

const skillRouter = express.Router();

skillRouter.post("/create", validate(skillSchema), async (req, res) => {
  const { shortName, fullName } = req.body as unknown as z.infer<
    typeof skillSchema
  >;

  // Check if the skill already exists
  const existingSkill = await prisma.skill.findUnique({
    where: { shortName: shortName },
  });

  if (existingSkill) {
    return errorResponse(res, "Skill already exists", null, 400);
  }

  const createdSkill = await prisma.skill.create({
    data: { shortName, fullName },
  });
  successResponse(res, "Skill created successfully", createdSkill, 201);
});

skillRouter.patch(
  "/update/:shortName",
  validate(skillSchema.partial()),
  async (req, res) => {
    const dataToUpdate = req.body as unknown as z.infer<typeof skillSchema>;
    const { shortName } = req.params as unknown as { shortName: string };
    // Check if the skill exists
    const isSkill = await prisma.skill.findUnique({
      where: { shortName: shortName },
    });

    if (!isSkill) {
      return errorResponse(res, "Skill does not exist", null, 404);
    }

    // If shortName is being updated, check for conflicts
    if (dataToUpdate.shortName && dataToUpdate.shortName !== shortName) {
      const conflictingSkill = await prisma.skill.findUnique({
        where: { shortName: dataToUpdate.shortName },
      });
      if (conflictingSkill) {
        return errorResponse(res, "Short name already exists", null, 400);
      }
    }

    const updatedSkill = await prisma.skill.update({
      where: { shortName: shortName },
      data: dataToUpdate,
    });

    successResponse(res, "Skill updated successfully", updatedSkill, 200);
  }
);

export default skillRouter;
