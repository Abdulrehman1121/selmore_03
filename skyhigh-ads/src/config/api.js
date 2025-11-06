export const API_URL =
  process.env.NODE_ENV === "production"
    ? "https://your-backend-domain.com/api" // live backend
    : "http://localhost:4000/api";          // local backend
