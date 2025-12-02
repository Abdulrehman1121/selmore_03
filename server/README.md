# Selmore Billboard Marketplace - Backend API

Production-ready backend API for the Selmore Billboard advertising marketplace platform.

## 🚀 Features

- ✅ **TypeScript** - Fully typed codebase
- ✅ **Express.js** - Fast, minimalist web framework
- ✅ **Prisma ORM** - Type-safe database access
- ✅ **PostgreSQL** - Robust relational database
- ✅ **JWT Authentication** - Secure token-based auth
- ✅ **Role-based Access Control** - Owner/Client/Admin roles
- ✅ **Rate Limiting** - Protection against abuse
- ✅ **Security Hardening** - Helmet, CORS, input validation
- ✅ **Error Handling** - Centralized error management
- ✅ **API Documentation** - RESTful endpoints
- ✅ **Vercel Ready** - Optimized for serverless deployment

## 📋 Prerequisites

- Node.js >= 18.x
- PostgreSQL database
- npm or yarn

## 🛠️ Installation

1. **Clone and Navigate**
```bash
cd server
```

2. **Install Dependencies**
```bash
npm install
```

3. **Environment Setup**
```bash
cp .env.example .env
```

Edit `.env` and configure your environment variables:
- `DATABASE_URL` - Your PostgreSQL connection string
- `JWT_SECRET` - Generate with: `openssl rand -base64 32`
- `CORS_ORIGIN` - Your frontend URL(s)

4. **Database Setup**
```bash
# Generate Prisma Client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# (Optional) Seed database
npm run seed
```

## 🏃 Running Locally

### Development Mode
```bash
npm run dev
```
Server runs at `http://localhost:4000`

### Production Build
```bash
npm run build
npm start
```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user (protected)

### Billboards
- `GET /api/billboards` - List all billboards
- `GET /api/billboards/:id` - Get billboard details
- `POST /api/billboards` - Create billboard (Owner only)
- `PUT /api/billboards/:id` - Update billboard (Owner only)
- `DELETE /api/billboards/:id` - Delete billboard (Owner only)

### Campaigns
- ` GET /api/campaigns` - List campaigns
- `GET /api/campaigns/:id` - Get campaign details
- `POST /api/campaigns` - Create campaign (Client only)

### Bids
- `POST /api/bids` - Place a bid
- `GET /api/billboards/:id/bids` - List bids for billboard
- `POST /api/bids/:id/respond` - Accept/reject bid (Owner only)

### Bookings
- `GET /api/bookings` - List user bookings
- `POST /api/bookings` - Create booking

### Messages
- `POST /api/messages` - Send message
- `GET /api/messages` - Get inbox

### Invoices
- `GET /api/invoices` - List invoices
- `GET /api/invoices/:id/download` - Download invoice PDF
- `POST /api/invoices/:id/pay` - Mark invoice as paid

### Health
- `GET /api/health` - Health check endpoint

## 🚀 Vercel Deployment

### Step 1: Prepare Database

Use a Vercel-compatible PostgreSQL provider:
- **Neon** (Recommended) - [neon.tech](https://neon.tech)
- **Supabase** - [supabase.com](https://supabase.com)
- **PlanetScale** - [planetscale.com](https://planetscale.com)
- **Heroku Postgres**
- **AWS RDS**

Get your connection string with connection pooling enabled.

### Step 2: Install Vercel CLI (Optional)
```bash
npm install -g vercel
```

### Step 3: Deploy to Vercel

#### Option A: Via Vercel Dashboard (Recommended)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your repository
5. Configure:
   - **Framework Preset**: Other
   - **Root Directory**: `server`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

6. Add Environment Variables:
   ```
   DATABASE_URL=your_pooled_connection_string
   DIRECT_DATABASE_URL=your_direct_connection_string
   JWT_SECRET=your_secret_key
   CORS_ORIGIN=https://yourfrontend.vercel.app
   NODE_ENV=production
   ```

7. Click "Deploy"

#### Option B: Via CLI
```bash
vercel --prod
```

### Step 4: Run Database Migrations

After deployment, run migrations:
```bash
# Using Vercel CLI
vercel env pull .env.production
npx prisma migrate deploy
```

Or configure in Vercel:
- Add build command: `npm run vercel-build`

### Step 5: Verify Deployment

Visit: `https://your-api.vercel.app/api/health`

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2024-12-02T...",
  "environment": "production"
}
```

## 🔒 Security Best Practices

1. **Never commit `.env` file** - Always use `.env.example`
2. **Use strong JWT secrets** - Minimum 32 characters
3. **Enable CORS only for trusted domains**
4. **Keep dependencies updated** - Run `npm audit` regularly
5. **Use connection pooling** - Essential for serverless
6. **Implement rate limiting** - Already configured
7. **Monitor your logs** - Use Vercel Analytics
8. **Set up database backups**

## 📊 Database Schema

The application uses Prisma ORM with the following models:
- **User** - User accounts (owners, clients, admins)
- **Billboard** - Advertisement billboards
- **Campaign** - Client advertising campaigns
- **Bid** - Bids on billboards
- **Booking** - Confirmed bookings
- **Invoice** - Payment invoices
- **Message** - User messaging
- **BillboardAnalytics** - Performance metrics

## 🐛 Troubleshooting

### Connection Pool Exhausted
- Use `DIRECT_DATABASE_URL` for migrations
- Enable connection pooling in `DATABASE_URL`

### CORS Errors
- Add your frontend URL to `CORS_ORIGIN`
- Check Vercel deployment domains

### Build Failures
- Ensure `NODE_ENV` is set
- Check all environment variables are configured
- Verify PostgreSQL connection

### 401 Unauthorized
- Check JWT_SECRET matches between deployments
- Verify token is sent in `Authorization: Bearer <token>` header

## 📦 Project Structure

```
server/
├── src/
│   ├── config/
│   │   └── env.ts           # Environment configuration
│   ├── controllers/         # Route controllers
│   ├── middleware/          # Express middleware
│   │   ├── auth.ts          # Authentication
│   │   ├── errorHandler.ts # Error handling
│   │   └── rateLimiter.ts  # Rate limiting
│   ├── routes/             # API routes
│   ├── utils/              # Utility functions
│   ├── app.ts              # Express app setup
│   ├── server.ts           # Server entry point
│   └── prismaClient.ts     # Prisma client
├── prisma/
│   ├── schema.prisma       # Database schema
│   ├── migrations/         # Database migrations
│   └── seed.ts             # Database seeding
├── .env.example            # Environment template
├── vercel.json             # Vercel configuration
├── tsconfig.json           # TypeScript configuration
└── package.json            # Dependencies
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📄 License

MIT License - See LICENSE file for details

## 🆘 Support

For issues and questions:
- Open an issue on GitHub
- Check existing documentation
- Review Vercel deployment logs

---

**Built with ❤️ for the Selmore Billboard Marketplace**
