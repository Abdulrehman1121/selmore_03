# Vercel Deployment Guide - Selmore Backend

## 📋 Pre-Deployment Checklist

- [ ] Code is committed to Git (GitHub, GitLab, or Bitbucket)
- [ ] PostgreSQL database is set up (Neon, Supabase, etc.)
- [ ] All environment variables are documented
- [ ] Database schema is finalized
- [ ] API  endpoints are tested locally

---

## 🎯 Step-by-Step Deployment

### 1. Database Setup (Choose One Provider)

#### Option A: Neon (Recommended - Free Tier Available)
1. Go to [neon.tech](https://neon.tech) and create an account
2. Create a new project
3. Copy the connection string (it includes pooling by default)
4. You'll get TWO connection strings:
   - **Pooled** (use for `DATABASE_URL`) - ends with `?sslmode=require`
   - **Direct** (use for `DIRECT_DATABASE_URL`) - includes `@ep-...`

#### Option B: Supabase
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Go to Settings → Database
4. Copy **Connection Pooling** string for `DATABASE_URL`
5. Copy **Direct Connection** string for `DIRECT_DATABASE_URL`

#### Option C: Railway / Heroku / AWS RDS
Set up PostgreSQL and get connection strings

---

### 2. Prepare Your Code

1. **Verify package.json scripts:**
```json
{
  "scripts": {
    "build": "prisma generate && tsc -p tsconfig.json",
    "start": "node dist/server.js",
    "vercel-build": "prisma generate && prisma migrate deploy && npm run build"
  }
}
```

2. **Ensure vercel.json exists** in `server/` directory

3. **Commit and Push to GitHub:**
```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

---

### 3. Deploy to Vercel

#### Via Vercel Dashboard (Easiest):

1. Go to [vercel.com](https://vercel.com/new) and sign in with GitHub
2. Click **"Add New Project"**
3. **Import your Git repository**
4. Configure project:

**General Settings:**
```
Framework Preset:     Other
Root Directory:       server
Build Command:        npm run build
Output Directory:     dist
Install Command:      npm install
Node.js Version:      18.x
```

5. **Add Environment Variables** (click "Environment Variables"):

```bash
# Required Variables
DATABASE_URL=postgresql://user:pass@host/db?pgbouncer=true&sslmode=require
DIRECT_DATABASE_URL=postgresql://user:pass@host/db?sslmode=require
JWT_SECRET=your-super-secret-key-min-32-chars
NODE_ENV=production
CORS_ORIGIN=https://yourfrontend.vercel.app

# Optional (with defaults)
JWT_EXPIRES_IN=7d
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

**Important:** Add each variable to all environments (Production, Preview, Development)

6. Click **"Deploy"**

---

### 4. Post-Deployment Steps

#### A. Run Database Migrations

After first deployment:

```bash
# Pull environment variables locally
vercel env pull .env.production

# Run migrations
npx prisma migrate deploy
```

Or configure automatic migrations in `vercel.json`:
- Already configured via `vercel-build` script

#### B. Verify Deployment

1. Visit your API: `https://your-api-name.vercel.app/api/health`

Expected Response:
```json
{
  "status": "ok",
  "timestamp": "2024-12-02T13:45:00.000Z",
  "environment": "production"
}
```

2. Test API root: `https://your-api-name.vercel.app/api`

Expected Response:
```json
{
  "message": "Selmore Billboard Marketplace API",
  "version": "1.0.0",
  "endpoints": { ... }
}
```

---

### 5. Connect Frontend to Backend

Update your frontend environment variables:

**For Next.js/Vite:**
```bash
# .env.production
VITE_API_URL=https://your-api-name.vercel.app
# or
NEXT_PUBLIC_API_URL=https://your-api-name.vercel.app
```

Update CORS in backend:
```
CORS_ORIGIN=https://your-frontend.vercel.app
```

If you have multiple frontends:
```
CORS_ORIGIN=https://frontend1.vercel.app,https://frontend2.com,http://localhost:3000
```

---

## 🔧 Vercel Configuration Details

### vercel.json Explained

```json
{
  "version": 2,
  "builds": [
    {
      "src": "dist/server.js",  // Your compiled TypeScript entry point
      "use": "@vercel/node"     // Use Node.js serverless runtime
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",       // Route all /api/* requests
      "dest": "dist/server.js"  // to your Express app
    }
  ],
  "env": {
    "NODE_ENV": "production"    // Set production environment
  }
}
```

---

## 🚨 Common Issues & Solutions

### Issue 1: "Cannot find module '@prisma/client'"
**Solution:**
- Ensure `postinstall` script runs `prisma generate`
- Check package.json:
```json
"scripts": {
  "postinstall": "prisma generate"
}
```

### Issue 2: "Connection pool exhausted"
**Solution:**
- Use pooled connection string for `DATABASE_URL`
- Add `?pgbouncer=true` to your connection string
- Use `DIRECT_DATABASE_URL` for migrations only

### Issue 3: CORS errors
**Solution:**
- Add your frontend URL to `CORS_ORIGIN` environment variable
- Include `https://` in the URL
- For multiple origins, separate with commas

### Issue 4: 401 Unauthorized on all requests
**Solution:**
- Verify `JWT_SECRET` is set in Vercel environment variables
- Ensure frontend is sending token in `Authorization: Bearer <token>` header
- Check token hasn't expired

### Issue 5: Build fails with TypeScript errors
**Solution:**
```bash
# Run locally first
npm run lint
npm run build

# Fix all TypeScript errors before deploying
```

### Issue 6: Functions timeout (10s limit)
**Solution:**
- Optimize database queries
- Add database indexes
- Consider upgrading Vercel plan for longer timeouts
- Use background jobs for long-running tasks

---

## 📊 Monitoring & Logs

### View Logs:
1. Go to Vercel Dashboard
2. Select your project
3. Click "Deployments"
4. Click on a deployment
5. View "Function Logs"

### Monitor Performance:
- Enable Vercel Analytics
- Monitor response times
- Track error rates
- Set up alerts

---

## 🔄 Updating Your Deployment

### Automatic Deployment (Recommended):
1. Push to GitHub:
```bash
git add .
git commit -m "Update API"
git push
```
2. Vercel automatically deploys

### Manual Deployment:
```bash
vercel --prod
```

### Rollback:
1. Go to Vercel Dashboard → Deployments
2. Find previous working deployment
3. Click "..." → "Promote to Production"

---

## 🔐 Security Checklist

- [ ] Strong JWT_SECRET (min 32 chars)
- [ ] CORS limited to your domains (not `*`)
- [ ] HTTPS only (Vercel provides this automatically)
- [ ] Rate limiting enabled
- [ ] Environment variables in Vercel (not in code)
- [ ] Database connection uses SSL
- [ ] No sensitive data in logs
- [ ] Dependencies updated (`npm audit`)

---

## 📈 Scaling Considerations

### Database:
- Use connection pooling (PgBouncer)
- Add indexes to frequently queried fields
- Monitor query performance
- Consider read replicas for high traffic

### API:
- Implement caching (Redis)
- Use CDN for static assets
- Optimize database queries
- Consider serverless functions per route

### Vercel Limits (Free Tier):
- 100 GB bandwidth/month
- 100 GB-hours serverless function execution
- 10s function timeout
- 12 concurrent builds

**Upgrade to Pro if you exceed these limits**

---

## 🎉 Deployment Complete!

Your API is now live at: `https://your-api-name.vercel.app`

### Next Steps:
1. ✅ Test all endpoints with Postman/Insomnia
2. ✅ Connect your frontend
3. ✅ Monitor logs and performance
4. ✅ Set up error tracking (Sentry, etc.)
5. ✅ Configure custom domain (optional)
6. ✅ Set up automated backups for database
7. ✅ Document your API (Swagger/OpenAPI)

---

## 📞 Support Resources

- **Vercel Docs:** https://vercel.com/docs
- **Prisma Docs:** https://www.prisma.io/docs
- **Neon Docs:** https://neon.tech/docs
- **GitHub Issues:** [Your repository]

---

**Made with ❤️ for production deployment**
