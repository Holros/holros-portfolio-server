// middlewares/validate.ts
import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";
import { errorResponse } from "../utils/serverResponse";

// Generic validation middleware
export const validate =
  (schema: ZodSchema, source: "body" | "query" | "params" = "body") =>
  (req: Request, res: Response, next: NextFunction) => {
    // console.log(req[source], "hilla")
    const result = schema.safeParse(req[source]);
    if (!result.success) {
      const validationErrors = result.error.errors.map((err) => ({
        field: err.path.join("."),
        message: err.message,
      }));
      return errorResponse(
        res,
        `Invalid request ${source}`,
        validationErrors,
        400
      );
    }

    if (source !== "query") req[source] = result.data;
    else req.safeQuery = result.data;
    return next();
  };
