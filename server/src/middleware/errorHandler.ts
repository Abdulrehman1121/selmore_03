import { Request, Response, NextFunction } from "express";
import { config } from "../config/env";

export class AppError extends Error {
    statusCode: number;
    isOperational: boolean;

    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}

export const errorHandler = (
    err: Error | AppError,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (res.headersSent) {
        return next(err);
    }

    let statusCode = 500;
    let message = "Internal Server Error";
    let stack: string | undefined;

    if (err instanceof AppError) {
        statusCode = err.statusCode;
        message = err.message;
    } else if (err.name === "ValidationError") {
        statusCode = 400;
        message = err.message;
    } else if (err.name === "UnauthorizedError") {
        statusCode = 401;
        message = "Unauthorized";
    } else if (err.name === "JsonWebTokenError") {
        statusCode = 401;
        message = "Invalid token";
    } else if (err.name === "TokenExpiredError") {
        statusCode = 401;
        message = "Token expired";
    } else {
        message = err.message || message;
    }

    // Log error for debugging
    console.error("Error:", {
        message: err.message,
        statusCode,
        stack: err.stack,
        url: req.url,
        method: req.method,
    });

    // Include stack trace only in development
    if (config.NODE_ENV === "development") {
        stack = err.stack;
    }

    res.status(statusCode).json({
        error: message,
        ...(stack && { stack }),
    });
};

export const notFoundHandler = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const error = new AppError(`Route ${req.originalUrl} not found`, 404);
    next(error);
};

export const asyncHandler = (
    fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
