import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      user?: { id: string; email: string };
    }
  }
}

const JWT_SECRET = process.env.REFRESH_SECRET;

export function authenticateUser(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies?.refreshToken || req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ success: false, message: "Authentication required" });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; email: string };
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: err });
  }
}