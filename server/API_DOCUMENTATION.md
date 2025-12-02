# 📘 Selmore API Documentation

**Base URL:** `https://your-api.vercel.app`  
**Version:** 1.0.0  
**Authentication:** Bearer Token (JWT)

---

## 🔐 Authentication

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "role": "client" // or "owner"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "client"
  }
}
```

### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "client",
    "profileImage": null
  }
}
```

### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "client",
    "profileImage": null,
    "totalRevenue": 0,
    "totalSpend": 0,
    "totalImpressions": 0
  }
}
```

---

## 🗒️ Billboards

### List All Billboards
```http
GET /api/billboards
```

**Response:**
```json
[
  {
    "id": 1,
    "title": "Times Square Billboard",
    "location": "Times Square, NYC",
    "city": "New York",
    "price": 5000.00,
    "priceType": "daily",
    "bookingType": "direct",
    "image": "/uploads/billboard-1.jpg",
    "type": "digital",
    "size": "48x14 feet",
    "weekPrice": 30000.00,
    "monthPrice": 100000.00,
    "impressions": 500000,
    "status": "available",
    "ownerId": 2,
    "owner": {
      "id": 2,
      "name": "Billboard Owner",
      "email": "owner@example.com"
    },
    "bookings": [],
    "bids": [],
    "createdAt": "2024-12-01T10:00:00.000Z",
    "updatedAt": "2024-12-01T10:00:00.000Z"
  }
]
```

### Get Single Billboard
```http
GET /api/billboards/:id
```

### Create Billboard (Owner Only)
```http
POST /api/billboards
Authorization: Bearer <owner_token>
Content-Type: multipart/form-data

{
  "title": "Downtown Billboard",
  "location": "Main Street",
  "city": "Los Angeles",
  "price": "3000",
  "priceType": "daily",
  "bookingType": "direct",
  "type": "static",
  "size": "14x48 feet",
  "weekPrice": "18000",
  "monthPrice": "60000",
  "image": <file>
}
```

**Response:**
```json
{
  "id": 2,
  "title": "Downtown Billboard",
  "location": "Main Street",
  "city": "Los Angeles",
  "price": 3000.00,
  ...
}
```

### Update Billboard (Owner Only)
```http
PUT /api/billboards/:id
Authorization: Bearer <owner_token>
Content-Type: multipart/form-data

{
  "title": "Updated Title",
  "price": "3500",
  ...
}
```

### Delete Billboard (Owner Only)
```http
DELETE /api/billboards/:id
Authorization: Bearer <owner_token>
```

**Response:**
```json
{
  "message": "Billboard deleted successfully"
}
```

---

## 📢 Campaigns

### List Campaigns
```http
GET /api/campaigns
Authorization: Bearer <token>
```

- **Clients** see their own campaigns
- **Owners** see campaigns with bids on their billboards

**Response:**
```json
[
  {
    "id": 1,
    "name": "Q4 Marketing",
    "title": "Holiday Sale Campaign",
    "description": "Christmas promotion",
    "clientId": 1,
    "budget": 50000.00,
    "impressions": 0,
    "status": "active",
    "startDate": "2024-12-01T00:00:00.000Z",
    "endDate": "2024-12-31T23:59:59.000Z",
    "mediaFiles": [],
    "createdAt": "2024-12-01T10:00:00.000Z"
  }
]
```

### Get Single Campaign
```http
GET /api/campaigns/:id
Authorization: Bearer <token>
```

### Create Campaign (Client Only)
```http
POST /api/campaigns
Authorization: Bearer <client_token>
Content-Type: application/json

{
  "title": "Summer Sale",
  "description": "Promote summer products",
  "budget": 25000,
  "startDate": "2024-06-01",
  "endDate": "2024-08-31"
}
```

---

## 💰 Bids

### Place a Bid
```http
POST /api/bids
Authorization: Bearer <client_token>
Content-Type: application/json

{
  "campaignId": 1,
  "billboardId": 1,
  "clientBid": 4500.00
}
```

**Response:**
```json
{
  "id": 1,
  "campaignId": 1,
  "billboardId": 1,
  "clientBid": 4500.00,
  "status": "pending",
  "createdAt": "2024-12-02T10:00:00.000Z"
}
```

### List Bids for Billboard
```http
GET /api/billboards/:id/bids
Authorization: Bearer <owner_token>
```

### Respond to Bid (Owner Only)
```http
POST /api/bids/:id/respond
Authorization: Bearer <owner_token>
Content-Type: application/json

{
  "action": "accept" // or "reject"
}
```

**Response (if accepted):**
```json
{
  "ok": true,
  "booking": {
    "id": 1,
    "billboardId": 1,
    "campaignId": 1,
    "ownerId": 2,
    "clientId": 1,
    "price": 4500.00,
    "status": "confirmed",
    ...
  }
}
```

---

## 📅 Bookings

### List Bookings
```http
GET /api/bookings
Authorization: Bearer <token>
```

- **Owners** see bookings for their billboards
- **Clients** see their bookings

**Response:**
```json
[
  {
    "id": 1,
    "ownerId": 2,
    "clientId": 1,
    "billboardId": 1,
    "campaignId": 1,
    "startDate": "2024-12-01T00:00:00.000Z",
    "endDate": "2024-12-31T23:59:59.000Z",
    "status": "confirmed",
    "price": 4500.00,
    "createdAt": "2024-12-02T10:00:00.000Z"
  }
]
```

### Create Booking
```http
POST /api/bookings
Authorization: Bearer <token>
Content-Type: application/json

{
  "billboardId": 1,
  "campaignId": 1,
  "ownerId": 2,
  "clientId": 1,
  "price": 4500,
  "startDate": "2024-12-01",
  "endDate": "2024-12-31"
}
```

---

## 💬 Messages

### Send Message
```http
POST /api/messages
Authorization: Bearer <token>
Content-Type: application/json

{
  "toUserId": 2,
  "subject": "Question about billboard",
  "body": "I'm interested in your Times Square billboard..."
}
```

**Response:**
```json
{
  "id": 1,
  "fromId": 1,
  "toId": 2,
  "subject": "Question about billboard",
  "body": "I'm interested in your Times Square billboard...",
  "content": "",
  "read": false,
  "createdAt": "2024-12-02T10:00:00.000Z"
}
```

### Get Inbox
```http
GET /api/messages
Authorization: Bearer <token>
```

**Response:**
```json
[
  {
    "id": 1,
    "fromId": 2,
    "toId": 1,
    "subject": "Re: Question about billboard",
    "body": "Thanks for your interest!",
    "read": false,
    "createdAt": "2024-12-02T11:00:00.000Z",
    "from": {
      "id": 2,
      "name": "Billboard Owner",
      "email": "owner@example.com"
    }
  }
]
```

---

## 🧾 Invoices

### List Invoices
```http
GET /api/invoices
Authorization: Bearer <token>
```

**Response:**
```json
[
  {
    "id": 1,
    "invoiceNumber": "INV-12345678",
    "amount": 4500.00,
    "status": "unpaid",
    "bookingId": 1,
    "createdAt": "2024-12-02T10:00:00.000Z"
  }
]
```

### Download Invoice PDF
```http
GET /api/invoices/:id/download
Authorization: Bearer <token>
```

**Response:** PDF file

### Mark Invoice as Paid
```http
POST /api/invoices/:id/pay
Authorization: Bearer <token>
```

---

## 🏥 Health & Status

### Health Check
```http
GET /api/health
```

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-12-02T13:45:00.000Z",
  "environment": "production"
}
```

### API Info
```http
GET /api
```

**Response:**
```json
{
  "message": "Selmore Billboard Marketplace API",
  "version": "1.0.0",
  "endpoints": {
    "auth": "/api/auth",
    "billboards": "/api/billboards",
    "campaigns": "/api/campaigns",
    "bids": "/api/bids",
    "bookings": "/api/bookings",
    "messages": "/api/messages",
    "invoices": "/api/invoices",
    "health": "/api/health"
  }
}
```

---

## ⚠️ Error Responses

### 400 Bad Request
```json
{
  "error": "Missing required fields: email, password"
}
```

### 401 Unauthorized
```json
{
  "error": "Invalid credentials"
}
```

### 403 Forbidden
```json
{
  "error": "Forbidden - Requires one of these roles: owner"
}
```

### 404 Not Found
```json
{
  "error": "Route /api/unknown not found"
}
```

### 429 Too Many Requests
```json
{
  "error": "Too many requests from this IP, please try again later."
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal Server Error"
}
```

---

## 🔑 Authentication Flow

1. **Register or Login** → Receive JWT token
2. **Store token** in localStorage/sessionStorage
3. **Include token** in all protected requests:
   ```javascript
   fetch('https://api.vercel.app/api/billboards', {
     headers: {
       'Authorization': `Bearer ${token}`
     }
   })
   ```
4. **Handle token expiration** → Re-login if 401 error

---

## 📊 Rate Limits

- **General API:** 100 requests per 15 minutes
- **Auth endpoints:** 5 requests per 15 minutes
- **Upload endpoints:** 20 uploads per hour

Rate limit headers:
```
RateLimit-Limit: 100
RateLimit-Remaining: 95
RateLimit-Reset: 1638454800
```

---

## 🧪 Testing with cURL

### Register:
```bash
curl -X POST https://your-api.vercel.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "SecurePass123!",
    "role": "client"
  }'
```

### Login:
```bash
curl -X POST https://your-api.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123!"
  }'
```

### Get Billboards (with auth):
```bash
curl https://your-api.vercel.app/api/billboards \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 🛠️ Support

- **Documentation:** README.md
- **Deployment Guide:** DEPLOYMENT.md
- **Production Checklist:** PRODUCTION_CHECKLIST.md
- **GitHub Issues:** [Your Repository]

---

**Last Updated:** 2024-12-02  
**API Version:** 1.0.0  
**Powered by:** Express + TypeScript + Prisma
