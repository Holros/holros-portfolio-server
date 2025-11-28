import express from "express";
import { PrismaClient } from "../generated/prisma";
import { withAccelerate } from "@prisma/extension-accelerate";
import { errorResponse, successResponse } from "../utils/serverResponse";
import { z } from "zod";
import { validate } from "../middlewares/validate";
import getPaginationObject from "../utils/getPaginationObject";

const userRouter = express.Router();

const prisma = new PrismaClient().$extends(withAccelerate());

//get my information
userRouter.get("/", async (req, res) => {
  const user = await prisma.user.findFirst({
    where: {
      id: process.env.MY_USER_ID,
    },
    include: {
      testimonials: true,
      skills: true,
    },
    omit: { hashedPassword: true },
  });

  if (user) successResponse(res, "Data fetched successfully", user, 200);
  else errorResponse(res, "User don't exist", null, 404);
});

//get all my currents skills will be needed to filter projects
userRouter.get("/skills", async (req, res) => {
  const skills = await prisma.skill.findMany({
    where: {
      userId: process.env.MY_USER_ID,
    },
    orderBy: {
      projects: { _count: "desc" },
    },
  });

  successResponse(
    res,
    skills.length > 0
      ? "Skills fetched successfully"
      : "No skills available yet",
    skills,
    200
  );
});

const querySchema = z
  .object({
    skills: z
      .union([z.string(), z.array(z.string())])
      .optional()
      .transform((v) => (v ? (Array.isArray(v) ? v : [v]) : [])),
    page: z.coerce.number().min(1).optional().default(1),
    page_size: z.coerce.number().min(1).optional().default(10),
  })
  .strict();

//get all my projects, optionally filter by skills
userRouter.get(
  "/projects",
  validate(querySchema, "query"),
  async (req, res) => {
    const { skills, page, page_size } = req.safeQuery as unknown as z.infer<
      typeof querySchema
    >;

    console.log({ skills });

    const pageNumber = Number(page);
    const pageSize = Number(page_size);

    // Normalize to array
    const skillArray = Array.isArray(skills) ? skills : skills ? [skills] : [];

    console.log({ skillArray });

    const filters =
      skillArray.length > 0
        ? {
            AND: skillArray.map((skill) => ({
              skills: {
                some: {
                  shortName: skill.toString().toLowerCase(),
                },
              },
            })),
          }
        : {};

    const projects = await prisma.project.findMany({
      where: {
        userId: process.env.MY_USER_ID,
        ...filters,
      },
      include: {
        skills: true,
      },
      take: pageSize,
      skip: (pageNumber - 1) * pageSize,
      orderBy: {
        updated_at: "desc",
      },
    });

    const totalCount = await prisma.project.count({
      where: { userId: process.env.MY_USER_ID, ...filters },
    });

    const paginationObject = getPaginationObject(
      totalCount,
      pageNumber,
      pageSize
    );

    successResponse(
      res,
      projects.length > 0
        ? "Projects fetched successfully"
        : "No matching projects found",
      {
        projects,
        pagination: paginationObject,
      },
      200
    );
  }
);

export default userRouter;
