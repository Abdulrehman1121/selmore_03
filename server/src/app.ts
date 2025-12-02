import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { config } from "./config/env";
import { apiLimiter } from "./middleware/rateLimiter";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";

import authRoutes from "./routes/auth";
import billboardRoutes from "./routes/billboards";
import campaignRoutes from "./routes/campaigns";
import bidRoutes from "./routes/bids";
import bookingRoutes from "./routes/bookings";
import messageRoutes from "./routes/messages";
import invoiceRoutes from "./routes/invoices";

const app = express();

// Trust proxy - required for rate limiting behind reverse proxies (Vercel, etc.)
app.set("trust proxy", 1);

// Security Middleware
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
    crossOriginEmbedderPolicy: false,
  })
);

// CORS Configuration
const corsOptions = {
  origin: function (origin: string | undefined, callback: Function) {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);

    const allowedOrigins = config.CORS_ORIGIN.split(",").map((o) => o.trim());

    if (allowedOrigins.includes("*") || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

// Request Logging
app.use(morgan(config.NODE_ENV === "production" ? "combined" : "dev"));

// Body Parsing Middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

// Rate Limiting
app.use(apiLimiter);

// Health Check Endpoint (before rate limiting to allow monitoring)
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    environment: config.NODE_ENV,
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/billboards", billboardRoutes);
app.use("/api/campaigns", campaignRoutes);
app.use("/api/bids", bidRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/invoices", invoiceRoutes);

// API Root
app.get("/api", (req, res) => {
  res.json({
    message: "Selmore Billboard Marketplace API",
    version: "1.0.0",
    endpoints: {
      auth: "/api/auth",
      billboards: "/api/billboards",
      campaigns: "/api/campaigns",
      bids: "/api/bids",
      bookings: "/api/bookings",
      messages: "/api/messages",
      invoices: "/api/invoices",
      health: "/api/health",
    },
  });
});

// 404 Handler - must be after all routes
app.use(notFoundHandler);

// Global Error Handler - must be last
app.use(errorHandler);

export default app;