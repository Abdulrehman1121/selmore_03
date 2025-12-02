import dotenv from "dotenv";

dotenv.config();

interface EnvConfig {
    NODE_ENV: string;
    PORT: number;
    DATABASE_URL: string;
    DIRECT_DATABASE_URL?: string;
    JWT_SECRET: string;
    JWT_EXPIRES_IN: string;
    UPLOAD_DIR: string;
    CORS_ORIGIN: string;
    RATE_LIMIT_WINDOW_MS: number;
    RATE_LIMIT_MAX_REQUESTS: number;
    CLIENT_URL: string;
}

function validateEnv(): EnvConfig {
    // Only validate in runtime, not during build
    const isRuntime = process.env.NODE_ENV !== undefined || process.argv.includes('--runtime');

    if (isRuntime) {
        const requiredEnvVars = ["DATABASE_URL", "JWT_SECRET"];
        const missing: string[] = [];

        requiredEnvVars.forEach((envVar) => {
            if (!process.env[envVar]) {
                missing.push(envVar);
            }
        });

        if (missing.length > 0) {
            console.warn(
                `Warning: Missing environment variables: ${missing.join(", ")}`
            );
        }
    }

    return {
        NODE_ENV: process.env.NODE_ENV || "development",
        PORT: parseInt(process.env.PORT || "4000", 10),
        DATABASE_URL: process.env.DATABASE_URL || "",
        DIRECT_DATABASE_URL: process.env.DIRECT_DATABASE_URL,
        JWT_SECRET: process.env.JWT_SECRET || "default-secret-change-in-production",
        JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",
        UPLOAD_DIR: process.env.UPLOAD_DIR || "uploads",
        CORS_ORIGIN: process.env.CORS_ORIGIN || "*",
        RATE_LIMIT_WINDOW_MS: parseInt(
            process.env.RATE_LIMIT_WINDOW_MS || "900000",
            10
        ),
        RATE_LIMIT_MAX_REQUESTS: parseInt(
            process.env.RATE_LIMIT_MAX_REQUESTS || "100",
            10
        ),
        CLIENT_URL: process.env.CLIENT_URL || "http://localhost:5173",
    };
}

export const config = validateEnv();
