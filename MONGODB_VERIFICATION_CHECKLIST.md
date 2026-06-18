# MongoDB Backend Connection Verification Checklist

Complete this checklist to verify your MongoDB Atlas connection is working correctly.

---

## Pre-Flight Checks

### MongoDB Atlas Setup
- [ ] Created free cluster in MongoDB Atlas
- [ ] Cluster is active and ready to use
- [ ] Created database user (username + password saved)
- [ ] IP whitelist set to `0.0.0.0/0` for development
- [ ] Have the connection string from MongoDB Atlas

### Backend Configuration
- [ ] Backend `.env` file has `MONGO_URI` with actual credentials
- [ ] `PORT=5012` is set in `.env`
- [ ] `AUTH_FALLBACK=false` in `.env`
- [ ] `NODE_ENV=development` in `.env`
- [ ] Backend dependencies installed: `npm install` in `/backend`

---

## Connection Tests

### 1. Start Backend Server
```bash
cd backend
npm run dev
```

**Checklist:**
- [ ] Server starts without errors
- [ ] See message: "✅ MongoDB connected successfully"
- [ ] See message: "BloodConnect CRM AI server running on port 5012"
- [ ] No authentication errors in logs

**Expected Log Output:**
```
============================================================
BloodConnect CRM - Backend Initialization
============================================================
PORT: 5012
NODE_ENV: development
MONGO_URI: ✓ Configured (Atlas/URI)
AUTH_FALLBACK: ✗ Disabled
============================================================

📍 Attempting MongoDB Atlas connection...
✅ MongoDB connected successfully on cluster0.abc123.mongodb.net
📊 Database: bloodconnect

BloodConnect CRM AI server running on port 5012
```

### 2. Check API Status (Different Terminal)
```bash
curl http://localhost:5012/api/status
```

**Expected Response:**
```json
{"status":"ok","service":"BloodConnect CRM AI Backend"}
```

- [ ] Returns status OK
- [ ] HTTP 200

### 3. Check Database Connection Status
```bash
curl http://localhost:5012/api/auth/fallback-status
```

**Expected Response:**
```json
{"fallback":false,"db":"connected"}
```

- [ ] Shows `"db":"connected"`
- [ ] Shows `"fallback":false`
- [ ] HTTP 200

---

## User Registration Test

### 4. Register New User
```bash
curl -X POST http://localhost:5012/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@bloodconnect.com",
    "password": "TestPass123",
    "confirmPassword": "TestPass123",
    "role": "donor"
  }'
```

**Expected Response (HTTP 201):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "redirect": "/home",
  "message": "User registered successfully",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Test User",
    "email": "test@bloodconnect.com",
    "role": "donor"
  }
}
```

**Checklist:**
- [ ] HTTP 201 Created
- [ ] `"success": true`
- [ ] Token is returned
- [ ] User object contains correct data
- [ ] No error messages in backend logs

### 5. Login with Registered User
```bash
curl -X POST http://localhost:5012/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@bloodconnect.com",
    "password": "TestPass123"
  }'
```

**Expected Response (HTTP 200):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "redirect": "/home",
  "message": "User logged in successfully",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Test User",
    "email": "test@bloodconnect.com",
    "role": "donor"
  }
}
```

**Checklist:**
- [ ] HTTP 200 OK
- [ ] `"success": true`
- [ ] Token is returned
- [ ] Can login with registered credentials

### 6. Test Duplicate Registration (Should Fail)
```bash
curl -X POST http://localhost:5012/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Duplicate",
    "email": "test@bloodconnect.com",
    "password": "TestPass123",
    "confirmPassword": "TestPass123",
    "role": "donor"
  }'
```

**Expected Response (HTTP 400):**
```json
{"message":"User already exists"}
```

- [ ] HTTP 400 Bad Request
- [ ] Returns "User already exists" error

---

## MongoDB Atlas Data Verification

### 7. Verify User Data in MongoDB Atlas

1. [ ] Go to: https://cloud.mongodb.com/v2
2. [ ] Click your cluster name
3. [ ] Click **Browse Collections** (or Collections tab)
4. [ ] Navigate to: `bloodconnect` → `users`
5. [ ] See your registered test user
6. [ ] Verify fields:
   - [ ] `_id`: MongoDB ObjectId
   - [ ] `name`: "Test User"
   - [ ] `email`: "test@bloodconnect.com"
   - [ ] `role`: "donor"
   - [ ] `createdAt`: Current timestamp

---

## Frontend Integration Test (Optional)

### 8. Start Frontend
```bash
cd frontend
npm run dev
```

### 9. Test Registration from UI
- [ ] Frontend loads without errors
- [ ] Can access registration page
- [ ] Can submit registration form
- [ ] Redirected to home page after successful registration
- [ ] No CORS errors in browser console

### 10. Test Login from UI
- [ ] Can access login page
- [ ] Can submit login form with credentials
- [ ] Redirected to home page after successful login
- [ ] User session is maintained

---

## Fallback Mode Test (Optional)

Only test if you want to verify fallback behavior.

### 11. Test Fallback Mode
1. Stop the backend server (Ctrl+C)
2. In `.env`, change: `AUTH_FALLBACK=true`
3. Restart backend: `npm run dev`
4. Verify log shows: `"fallback": true` in status endpoint
5. Try registration/login - should work with in-memory auth

---

## Troubleshooting Failures

| Issue | Solution |
|-------|----------|
| ❌ No connection message | Check MONGO_URI has real credentials (not `<user>/<password>` placeholders) |
| ❌ "Authentication failed" | Verify username/password in MONGO_URI are URL-encoded if they have special chars |
| ❌ HTTP 503 error | Set `AUTH_FALLBACK=true` temporarily to test fallback mode |
| ❌ CORS errors | Frontend CORS is configured - check backend is running on port 5012 |
| ❌ "Cannot find module" | Run `npm install` in backend folder |
| ❌ Connection timeout | Check MongoDB Atlas IP whitelist is `0.0.0.0/0` |

---

## Success Criteria

You have successfully connected MongoDB Atlas to the backend if:

✅ Backend starts with "✅ MongoDB connected successfully"
✅ API status endpoint returns HTTP 200
✅ Database connection status shows `"db":"connected"`
✅ Can register new users via API
✅ Can login with registered users
✅ User data appears in MongoDB Atlas collections
✅ Duplicate registrations are rejected
✅ Frontend (if running) can register/login without CORS errors

---

## Next Steps

Once all checks pass:

1. ✅ MongoDB Atlas connection verified
2. → Deploy backend to production (update MONGO_URI with production credentials)
3. → Setup frontend environment variables
4. → Configure other API endpoints (donors, emergency, analytics)
5. → Run full end-to-end tests

---

## Reference Commands

**Check Logs:**
```bash
# Backend logs are printed to console when running
npm run dev
```

**Quick Test:**
```bash
# All-in-one test
curl -X POST http://localhost:5012/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"User","email":"user@test.com","password":"Pass123","confirmPassword":"Pass123","role":"donor"}' \
  && curl http://localhost:5012/api/status
```

**Database Info:**
```bash
# From MongoDB Atlas web console
# Collections → bloodconnect → users (view registered users)
# Collections → bloodconnect → [other collections] (view other data)
```

---

## Support Resources

- [MongoDB Backend Connection Guide](MONGODB_BACKEND_CONNECTION.md)
- [MongoDB Atlas Setup Guide](MONGODB_ATLAS_SETUP.md)
- [Backend Configuration](backend/.env)
- [Database Connection Code](backend/config/db.js)
- [Auth Routes](backend/routes/auth.js)
