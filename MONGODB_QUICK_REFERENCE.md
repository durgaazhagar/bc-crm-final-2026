# MongoDB Backend Setup - Quick Reference

## 1️⃣ MongoDB Atlas Setup (Cloud Database)
```bash
# Go to: https://www.mongodb.com/cloud/atlas
# 1. Create free account
# 2. Create free M0 cluster
# 3. Create database user (save username & password)
# 4. Whitelist IP: 0.0.0.0/0 (development)
# 5. Get connection string
```

## 2️⃣ Backend Configuration

**Update: `backend/.env`**
```env
PORT=5012
NODE_ENV=development
MONGO_URI=mongodb+srv://username:password@cluster0.abc123.mongodb.net/bloodconnect
AUTH_FALLBACK=false
DB_MAX_RETRIES=5
DB_INITIAL_DELAY_MS=2000
JWT_SECRET=bloodconnect-secret-2026
```

## 3️⃣ Install Dependencies
```bash
cd backend
npm install
```

## 4️⃣ Start Backend
```bash
cd backend
npm run dev
```

**Expected Output:**
```
✅ MongoDB connected successfully on cluster0.xyz.mongodb.net
📊 Database: bloodconnect
BloodConnect CRM AI server running on port 5012
```

## 5️⃣ Test Connection

**Status Check:**
```bash
curl http://localhost:5012/api/status
# Expected: {"status":"ok","service":"BloodConnect CRM AI Backend"}
```

**DB Status:**
```bash
curl http://localhost:5012/api/auth/fallback-status
# Expected: {"fallback":false,"db":"connected"}
```

**Register User:**
```bash
curl -X POST http://localhost:5012/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name":"John Doe",
    "email":"john@test.com",
    "password":"Pass123",
    "confirmPassword":"Pass123",
    "role":"donor"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:5012/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@test.com","password":"Pass123"}'
```

## 6️⃣ Verify in MongoDB Atlas
```
1. Go to https://cloud.mongodb.com
2. Click your cluster
3. Browse Collections → bloodconnect → users
4. See registered user data ✓
```

## Common Issues & Fixes

| Problem | Solution |
|---------|----------|
| `MongoNetworkError` | Check IP whitelist is `0.0.0.0/0` in MongoDB Atlas |
| `Authentication failed` | Verify username/password in MONGO_URI (URL encode special chars) |
| `Cannot find module 'mongoose'` | Run: `npm install` in backend folder |
| No connection message | MONGO_URI has placeholder values - replace with real credentials |
| Port 5012 in use | Change PORT in `.env` or kill process using port |
| CORS errors | Frontend is on different port - backend CORS is configured |

## Connection String Format

```
mongodb+srv://[USERNAME]:[PASSWORD]@[CLUSTER].mongodb.net/[DATABASE]

Example:
mongodb+srv://bloodconnect_user:MyPass123@cluster0.a1b2c3d4.mongodb.net/bloodconnect

Special chars (URL encode):
@ → %40
# → %23
: → %3A
```

## Environment Variables Explained

| Variable | Purpose | Example |
|----------|---------|---------|
| `MONGO_URI` | MongoDB Atlas connection string | `mongodb+srv://user:pass@cluster0...` |
| `PORT` | Backend server port | `5012` |
| `AUTH_FALLBACK` | Use in-memory auth if DB down | `false` (production) or `true` (dev) |
| `DB_MAX_RETRIES` | How many times to retry connection | `5` |
| `DB_INITIAL_DELAY_MS` | Initial retry delay in ms | `2000` |
| `JWT_SECRET` | Secret key for JWT tokens | `bloodconnect-secret-2026` |

## File Reference

```
backend/
├── .env                 # Environment variables (UPDATE THIS)
├── .env.example         # Template
├── server.js            # Main server file
├── config/
│   └── db.js           # MongoDB connection logic
├── routes/
│   └── auth.js         # Registration/login endpoints
└── models/
    └── User.js         # User data model
```

## Full Documentation

- [MongoDB Backend Connection Guide](MONGODB_BACKEND_CONNECTION.md) - Detailed setup
- [MongoDB Atlas Setup Guide](MONGODB_ATLAS_SETUP.md) - Cloud database setup
- [Verification Checklist](MONGODB_VERIFICATION_CHECKLIST.md) - Test your setup

## Quick Start (5 Minutes)

```bash
# 1. Setup MongoDB Atlas (manual step, 5 min)
#    Follow: MONGODB_ATLAS_SETUP.md

# 2. Update backend/.env with MONGO_URI
#    Copy connection string from MongoDB Atlas

# 3. Install backend
cd backend
npm install

# 4. Start backend
npm run dev

# 5. Check connection
curl http://localhost:5012/api/auth/fallback-status
```

That's it! Backend is connected to MongoDB Atlas. 🚀
