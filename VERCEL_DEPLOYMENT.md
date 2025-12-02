# Vercel Deployment Guide for Selmore

This guide explains how to deploy the Selmore full-stack application (Frontend + Backend) to Vercel.

## Prerequisites

1.  **Vercel Account**: Sign up at [vercel.com](https://vercel.com).
2.  **PostgreSQL Database**: You need a hosted PostgreSQL database (e.g., Neon, Supabase, Railway).
    *   Get the **Connection String** (Pooled) and **Direct Connection String**.

---

## 1. Backend Deployment (`server` folder)

The backend is an Express app configured for Vercel Serverless Functions.

### Steps:

1.  **Push to GitHub**: Ensure your project is pushed to a GitHub repository.
2.  **Import Project in Vercel**:
    *   Go to Vercel Dashboard -> **Add New** -> **Project**.
    *   Select your repository.
3.  **Configure Project**:
    *   **Root Directory**: Click "Edit" and select `server`.
    *   **Framework Preset**: Select "Other" (or let it auto-detect, but ensure settings below).
    *   **Build Command**: `npm run vercel-build`
        *   *Note: This runs `prisma generate`, `prisma migrate deploy`, and `tsc`.*
    *   **Output Directory**: `dist`
    *   **Install Command**: `npm install`
4.  **Environment Variables**:
    Add the following environment variables in the Vercel Project Settings:

    | Variable | Description | Example |
    | :--- | :--- | :--- |
    | `NODE_ENV` | Environment | `production` |
    | `DATABASE_URL` | Pooled Connection String | `postgres://user:pass@host:5432/db?pgbouncer=true` |
    | `DIRECT_DATABASE_URL` | Direct Connection String | `postgres://user:pass@host:5432/db` |
    | `JWT_SECRET` | Secret for Auth | `your-secure-random-secret` |
    | `JWT_EXPIRES_IN` | Token Expiry | `7d` |
    | `CORS_ORIGIN` | Allowed Frontend URL | `https://your-frontend.vercel.app` (Add this AFTER deploying frontend) |
    | `RATE_LIMIT_WINDOW_MS` | Rate Limit Window | `900000` |
    | `RATE_LIMIT_MAX_REQUESTS` | Max Requests | `100` |

5.  **Deploy**: Click **Deploy**.
    *   *Note: If migration fails during build, ensure your database is accessible from Vercel.*

6.  **Get Backend URL**:
    *   Once deployed, copy the domain (e.g., `https://selmore-backend.vercel.app`).
    *   Test health check: `https://selmore-backend.vercel.app/api/health`

---

## 2. Frontend Deployment (`skyhigh-ads` folder)

The frontend is a Vite + React application.

### Steps:

1.  **Import Project in Vercel** (Again):
    *   Go to Vercel Dashboard -> **Add New** -> **Project**.
    *   Select the **SAME** repository.
2.  **Configure Project**:
    *   **Project Name**: e.g., `selmore-frontend`.
    *   **Root Directory**: Click "Edit" and select `skyhigh-ads`.
    *   **Framework Preset**: Vercel should auto-detect **Vite**.
    *   **Build Command**: `vite build` (default)
    *   **Output Directory**: `dist` (default)
3.  **Environment Variables**:
    Add the following:

    | Variable | Description | Example |
    | :--- | :--- | :--- |
    | `VITE_API_URL` | URL of your deployed Backend | `https://selmore-backend.vercel.app` |

4.  **Deploy**: Click **Deploy**.

---

## 3. Final Configuration

1.  **Update Backend CORS**:
    *   Go back to your **Backend Project** on Vercel.
    *   Update `CORS_ORIGIN` to your **Frontend URL** (e.g., `https://selmore-frontend.vercel.app`).
    *   Redeploy the backend (Deployment -> Redeploy) for changes to take effect.

2.  **Verify**:
    *   Open your Frontend URL.
    *   Try to Login/Signup.
    *   Check Network tab to ensure requests are going to the backend URL.

---

## Troubleshooting

*   **Database Connection Errors**: Ensure your database allows connections from Vercel (0.0.0.0/0 or Vercel IP ranges).
*   **CORS Errors**: Double-check `CORS_ORIGIN` in backend and `VITE_API_URL` in frontend.
*   **404 on Refresh**: The `vercel.json` in `skyhigh-ads` handles rewrites to `index.html`. Ensure it is present.
