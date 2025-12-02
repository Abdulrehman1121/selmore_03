import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import prisma from "../prismaClient";
import { config } from "../config/env";
import { AppError } from "./errorHandler";

export interface AuthRequest extends Request {
  user?: any;
}

interface JWTPayload {
  userId: number;
  role: string;
}

export const authGuard = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new AppError("No authorization token provided", 401);
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      throw new AppError("Invalid token format", 401);
    }

    const payload = jwt.verify(token, config.JWT_SECRET) as JWTPayload;

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        profileImage: true,
        totalRevenue: true,
        totalSpend: true,
        totalImpressions: true,
      },
    });

    if (!user) {
      throw new AppError("User not found", 401);
    }

    req.user = user;
    next();
  } catch (err: any) {
    if (err.name === "JsonWebTokenError") {
      return next(new AppError("Invalid token", 401));
    }
    if (err.name === "TokenExpiredError") {
      return next(new AppError("Token expired", 401));
    }
    next(err);
  }
};

export const roleGuard = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError("Unauthorized - User not authenticated", 401));
    }

    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(
          `Forbidden - Requires one of these roles: ${roles.join(", ")}`,
          403
        )
      );
    }

    next();
  };
};

