import validator from "validator";
import { AppError } from "../middleware/errorHandler";

export const validateEmail = (email: string): boolean => {
    if (!validator.isEmail(email)) {
        throw new AppError("Invalid email format", 400);
    }
    return true;
};

export const validatePassword = (password: string): boolean => {
    if (!password || password.length < 8) {
        throw new AppError("Password must be at least 8 characters long", 400);
    }
    return true;
};

export const validateRequired = (
    fields: Record<string, any>,
    requiredFields: string[]
): boolean => {
    const missing = requiredFields.filter((field) => !fields[field]);
    if (missing.length > 0) {
        throw new AppError(
            `Missing required fields: ${missing.join(", ")}`,
            400
        );
    }
    return true;
};

export const sanitizeString = (str: string): string => {
    return validator.escape(validator.trim(str));
};

export const validateNumber = (value: any, fieldName: string): number => {
    const num = Number(value);
    if (isNaN(num)) {
        throw new AppError(`${fieldName} must be a valid number`, 400);
    }
    return num;
};

export const validatePositiveNumber = (
    value: any,
    fieldName: string
): number => {
    const num = validateNumber(value, fieldName);
    if (num < 0) {
        throw new AppError(`${fieldName} must be a positive number`, 400);
    }
    return num;
};

export const validateRole = (role: string): boolean => {
    const validRoles = ["owner", "client", "admin"];
    if (!validRoles.includes(role)) {
        throw new AppError(
            `Invalid role. Must be one of: ${validRoles.join(", ")}`,
            400
        );
    }
    return true;
};

export const validateStatus = (
    status: string,
    validStatuses: string[]
): boolean => {
    if (!validStatuses.includes(status)) {
        throw new AppError(
            `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
            400
        );
    }
    return true;
};
