import { Request, Response } from "express";
import prisma from "../prismaClient";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { config } from "../config/env";
import { validateEmail, validatePassword, validateRequired } from "../utils/validation";
import { asyncHandler, AppError } from "../middleware/errorHandler";

// 🟩 Register user
export const register = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password, role } = req.body;

  // Validate required fields
  validateRequired(req.body, ["name", "email", "password"]);

  // Validate email format
  validateEmail(email);

  // Validate password strength
  validatePassword(password);

  // Check if user already exists
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw new AppError("Email already registered", 400);
  }

  // Hash password
  const hash = await bcrypt.hash(password, 12);

  // Create user
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hash,
      role: role || "client",
    },
  });

  // Generate JWT token
  const token = jwt.sign({ userId: user.id, role: user.role }, config.JWT_SECRET, {
    expiresIn: config.JWT_EXPIRES_IN as any,
  });

  res.status(201).json({
    success: true,
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

// 🟩 Login user
export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // Validate required fields
  validateRequired(req.body, ["email", "password"]);

  // Validate email format
  validateEmail(email);

  // Find user
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new AppError("Invalid credentials", 401);
  }

  // Check password
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    throw new AppError("Invalid credentials", 401);
  }

  // Generate JWT token
  const token = jwt.sign({ userId: user.id, role: user.role }, config.JWT_SECRET, {
    expiresIn: config.JWT_EXPIRES_IN as any,
  });

  res.json({
    success: true,
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      profileImage: user.profileImage,
    },
  });
});

// 🟩 Get logged-in user
export const me = asyncHandler(async (req: any, res: Response) => {
  const user = req.user;

  if (!user) {
    throw new AppError("User not found", 404);
  }

  res.json({
    success: true,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      profileImage: user.profileImage,
      totalRevenue: user.totalRevenue,
      totalSpend: user.totalSpend,
      totalImpressions: user.totalImpressions,
    },
  });
});

