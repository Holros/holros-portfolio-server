import jwt from "jsonwebtoken";
import { createError } from "./createError";

const accessJwtSecret = process.env.ACCESS_JWT_SECRET || "";
const refreshJwtSecret = process.env.REFRESH_JWT_SECRET || "";

export function generateTokens(user: { email: string; id: string }) {
  const accessToken = jwt.sign(
    { email: user.email, id: user.id },
    accessJwtSecret,
    {
      expiresIn: "15m",
    }
  );

  const refreshToken = jwt.sign(
    { email: user.email, id: user.id },
    refreshJwtSecret,
    {
      expiresIn: "7d",
    }
  );

  return { accessToken, refreshToken };
}

export function refreshTokens(refreshToken: string) {
  try {
    const decode = jwt.verify(refreshToken, refreshJwtSecret) as UserData;

    const newAccessToken = jwt.sign(
      {
        email: decode.email,
        id: decode.id,
      },
      accessJwtSecret,
      { expiresIn: "15m" }
    );

    const newRefreshToken = jwt.sign(
      {
        email: decode.email,
        id: decode.id,
      },
      refreshJwtSecret,
      { expiresIn: "7d" }
    );

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  } catch {
    throw createError(
      "Refresh token invalid or expired, please login again",
      400
    );
  }
}
