import { NextFunction, Request, Response } from "express";
import { errorResponse } from "../utils/serverResponse";
import jwt from "jsonwebtoken";

const accessJwtSecret = process.env.ACCESS_JWT_SECRET || "";

export default function loginRequired(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return errorResponse(
      res,
      "Access token required, Please login first",
      null,
      400
    );
  }

  const token = authHeader.split(" ")[1];

  if (!token)
    return errorResponse(
      res,
      "Access token required, Please login first",
      null,
      400
    );

  try {
    const decoded = jwt.verify(token, accessJwtSecret);
    req.user = decoded as UserData;
    next();
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      return errorResponse(res, "Access token expired", null, 401); // frontend tries refresh on 401
    }

    return errorResponse(res, "Invalid access token", null, 400);
  }
}
