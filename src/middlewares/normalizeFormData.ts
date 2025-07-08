import { Request, Response, NextFunction } from "express";
import { errorResponse } from "../utils/serverResponse";

//Middleware to convert stringified booleans and JSON objects in form data
// when using multer which converts incoming data to strings
export const normalizeFormData = (
  booleanFields: string[] = [],
  jsonFields: string[] = []
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.body) return next();

    // Convert "true"/"false" strings to actual booleans
    for (const field of booleanFields) {
      if (req.body[field] !== undefined) {
        req.body[field] = req.body[field] === "true";
      }
    }

    // Parse JSON strings into objects/arrays
    for (const field of jsonFields) {
      if (req.body[field] !== undefined) {
        try {
          req.body[field] = JSON.parse(req.body[field]);
        } catch (err) {
          return errorResponse(
            res,
            `Invalid JSON format in field '${field}'`,
            err,
            400
          );
        }
      }
    }

    next();
  };
};
