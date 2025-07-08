import { Response } from "express";

export const successResponse = (
  res: Response,
  message: string = "Request was successful",
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any = null,
  statusCode = 200
) => {
  res.status(statusCode).json({ success: true, message, data, errors: null });
};

export const errorResponse = (
  res: Response,
  message: string = "An error occurred",
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  errors: any = null,
  statusCode = 400
) => {
  res.status(statusCode).json({ success: false, message, data: null, errors });
};
