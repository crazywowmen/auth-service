import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
): Response | void => {
  try {
    const { authorization } = req.headers;
    if (!authorization) {
      return res.status(401).json({ error: "unauthorized user" });
    }

    const { userId } = jwt.verify(
      authorization,
      process.env.JWT_SECRET_AUTH_SERVICE as string,
    ) as { userId: string };

    req.user = userId;

    next();
  } catch (error) {
    return res.status(401).json({ error: "unauthorized user" });
  }
};
