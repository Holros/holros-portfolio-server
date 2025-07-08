import express from "express";
import { validate } from "../middlewares/validate";
import { loginSchema } from "../schemas/loginSchema";
import { z } from "zod";
import { prisma } from "../utils/db";
import { errorResponse, successResponse } from "../utils/serverResponse";
import bcrypt from "bcryptjs";
import { generateTokens, refreshTokens } from "../utils/authTokens";

const authRouter = express.Router();

authRouter.post("/login", validate(loginSchema), async (req, res) => {
  const { email, password } = req.body as z.infer<typeof loginSchema>;

  const user = await prisma.user.findFirst({
    where: {
      email: {
        equals: email,
        mode: "insensitive",
      },
    },
  });

  if (!user) return errorResponse(res, "Wrong email or password", null, 400);

  const { hashedPassword, ...userWithoutPassword } = user;

  const passwordMatches = await bcrypt.compare(password, hashedPassword);

  if (!passwordMatches)
    return errorResponse(res, "Wrong email or password", null, 400);

  const tokens = generateTokens(user);

  successResponse(
    res,
    "Login successful",
    {
      user: userWithoutPassword,
      tokens,
    },
    200
  );
});

const refreshTokenSchema = z
  .object({
    refreshToken: z.string(),
  })
  .strict();

authRouter.post("/refresh", validate(refreshTokenSchema), async (req, res) => {
  const { refreshToken } = req.body as z.infer<typeof refreshTokenSchema>;

  const tokens = refreshTokens(refreshToken);

  successResponse(res, "Token refreshed", tokens, 200);
});

export default authRouter;
