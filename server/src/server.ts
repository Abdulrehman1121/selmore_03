import dotenv from "dotenv";
import app from "./app";

dotenv.config();
const port = process.env.PORT || 4000;

if (process.env.VERCEL) {
  // Vercel serverless function mode
  console.log("🚀 Running in Vercel Serverless Mode");
} else {
  // Local development or standalone server mode
  app.listen(port, () => {
    console.log(`✅ Server listening on http://localhost:${port}`);
  });
}

export default app;
