import { Request, Response, NextFunction } from "express";
import { CallbackError } from "mongoose";

const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err);
  if (res.headersSent) {return next(err as CallbackError);}
  res.status(500).json({ error: "An unexpected error occurred" });
};

export default errorHandler;
