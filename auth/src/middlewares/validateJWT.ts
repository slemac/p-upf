import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AccountPayload } from "../interfaces/account-payload";

export const validateJWT = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.session?.jwt) {
    return next();
  }

  try {
    const payload = jwt.verify(
      req.session.jwt,
      process.env.JWT_PRIVATE_KEY!
    ) as AccountPayload;
    req.currentAccount = payload;
  } catch (err) {}

  next();
};
