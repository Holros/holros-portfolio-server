import { NextFunction, Request, Response } from "express";
import { Prisma } from "../generated/prisma";
import { errorResponse } from "../utils/serverResponse";

const errorHandler = (
  err: Error & { statusCode?: number },
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
) => {
  // Log all errors for debugging
  console.error("Error caught by errorHandler:", err);

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case "P2002":
        return errorResponse(
          res,
          `Duplicate value: ${err.meta?.target} already exists.`,
          null,
          400
        );
      case "P2025":
        return errorResponse(res, "Record not found.", null, 404);
      default:
        return errorResponse(
          res,
          "We couldn't process your request due to a database issue. Please try again.",
          null,
          500
        );
    }
  }
  if (err instanceof Prisma.PrismaClientValidationError) {
    return errorResponse(res, "Validation error", err.message, 400);
  }
  if (err instanceof Prisma.PrismaClientInitializationError) {
    return errorResponse(
      res,
      "We are having trouble connecting to the server. Please try again later.",
      null,
      500
    );
  }

  if (err.statusCode) {
    return errorResponse(res, err.message, null, err.statusCode);
  } else
    return errorResponse(
      res,
      "Something went wrong, please try again later",
      null,
      500
    );
};

export default errorHandler;
