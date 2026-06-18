# MongoDB Atlas Backend Connection Guide

## Quick Setup (10 Minutes)

This guide connects your BloodConnect CRM backend to MongoDB Atlas.

---

## Step 1: Setup MongoDB Atlas Cluster

Follow the quick start guide: [MONGODB_ATLAS_SETUP.md](MONGODB_ATLAS_SETUP.md)

After completing that guide, you'll have:
- ✓ Free MongoDB Atlas account
- ✓ Active cluster
- ✓ Database user (username + password)
- ✓ IP whitelist (0.0.0.0/0 for development)

**Next:** Get your connection string from MongoDB Atlas.

---

## Step 2: Get Connection String from MongoDB Atlas

1. Go to: https://cloud.mongodb.com/v2
2. Click your **Cluster** name
3. Click **Connect** button
4. Choose **"Connect your application"**
5. Select **Node.js** driver
6. Copy the connection string (looks like this):
   ```
   mongodb+srv://bloodconnect_user:MyPassword123@cluster0.abc123.mongodb.net/?retryWrites=true&w=majority
   ```

⚠️ **Important:** 
- Replace `<username>` with your actual username (e.g., `bloodconnect_user`)
- Replace `<password>` with your actual password
- If password has special characters, URL encode them:
  - `@` → `%40`
  - `#` → `%23`
  - `:` → `%3A`
  - Use an [online encoder](https://www.urlencoder.org/) if needed

**Example (with placeholders):**
```
mongodb+srv://bloodconnect_user:MySecurePass123@cluster0.a1b2c3d4e5.mongodb.net/bloodconnect?retryWrites=true&w=majority
```

---

## Step 3: Update Backend `.env` File

1. Open: `backend/.env`
2. Update the `MONGO_URI` line:
   ```env
   MONGO_URI=mongodb+srv://bloodconnect_user:MySecurePass123@cluster0.a1b2c3d4e5.mongodb.net/bloodconnect?retryWrites=true&w=majority
   ```

3. Verify other settings:
   ```env
   PORT=5012
   NODE_ENV=development
   AUTH_FALLBACK=false
   DB_MAX_RETRIES=5
   DB_INITIAL_DELAY_MS=2000
   JWT_SECRET=bloodconnect-secret-2026
   ```

4. Save the file

---

## Step 4: Install Backend Dependencies

```bash
cd backend
npm install
```

---

## Step 5: Test MongoDB Connection

### Option A: Start Backend Server
```bash
# Terminal in 'backend' folder
npm run dev
```

**Expected Output:**
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
✅ MongoDB connected successfully on cluster0.a1b2c3d4e5.mongodb.net
📊 Database: bloodconnect

BloodConnect CRM AI server running on port 5012
```

### Option B: Quick Connection Test
```bash
# From backend folder
node test-mongodb.js
```

---

## Step 6: Test Registration & Login (Verify Data Saved in Atlas)

### Test Registration

**Using curl:**
```bash
curl -X POST http://localhost:5012/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Donor",
    "email": "john@bloodconnect.com",
    "password": "SecurePass123",
    "confirmPassword": "SecurePass123",
    "role": "donor"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "redirect": "/home",
  "message": "User registered successfully",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Donor",
    "email": "john@bloodconnect.com",
    "role": "donor"
  }
}
```

### Test Login

```bash
curl -X POST http://localhost:5012/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@bloodconnect.com",
    "password": "SecurePass123"
  }'
```

### Verify Data in MongoDB Atlas

1. Go to: https://cloud.mongodb.com/v2
2. Click your **Cluster**
3. Click **Collections** tab
4. Navigate to **bloodconnect → users**
5. See your registered user data ✓

---

## Connection Status Checks

### Check Backend Status
```bash
curl http://localhost:5012/api/status
```

**Response:**
```json
{ "status": "ok", "service": "BloodConnect CRM AI Backend" }
```

### Check DB Connection Status
```bash
curl http://localhost:5012/api/auth/fallback-status
```

**If Connected:**
```json
{ "fallback": false, "db": "connected" }
```

**If Fallback Enabled:**
```json
{ "fallback": true }
```

**If Error:**
```json
{ "error": "Server unavailable" }
```

---

## Troubleshooting

### ❌ "MongoDB connection error: MongoNetworkError"

**Cause:** Network connectivity issue

**Fix:**
1. Check MongoDB Atlas IP whitelist is set to `0.0.0.0/0`
2. Verify MONGO_URI in `.env` file is correct
3. Check internet connection
4. Verify username/password in connection string

### ❌ "MongoDB connection error: Authentication failed"

**Cause:** Wrong username or password

**Fix:**
1. Double-check MONGO_URI credentials
2. If password has special characters, URL encode them
3. Reset password in MongoDB Atlas if needed

### ❌ "Cannot find module 'mongoose'"

**Fix:**
```bash
cd backend
npm install
```

### ❌ Backend runs but no connection message appears

**Fix:**
1. Check `.env` file has `MONGO_URI` set (not placeholder values)
2. Check `NODE_ENV=development`
3. Restart backend with `npm run dev`

### ✓ "MongoDB connected successfully" but registration fails

**Possible Causes:**
- Database user doesn't have collection creation permissions
- `AUTH_FALLBACK=false` and database is rejecting the request
- JWT secret mismatch

**Fix:**
1. In MongoDB Atlas, regenerate database user with full permissions
2. Temporarily set `AUTH_FALLBACK=true` to test with fallback
3. Restart backend after `.env` changes

---

## Next Steps

Once MongoDB connection is working:

1. ✅ Backend running with MongoDB connected
2. ✅ Register/login working with data saved in Atlas
3. → Start frontend: `cd frontend && npm run dev`
4. → Test full registration flow through UI
5. → Test other API endpoints (/api/donors, /api/emergency, etc.)

---

## Reference Files

- **Backend Config:** [backend/.env](backend/.env)
- **Database Connection:** [backend/config/db.js](backend/config/db.js)
- **Auth Routes:** [backend/routes/auth.js](backend/routes/auth.js)
- **MongoDB Setup:** [MONGODB_ATLAS_SETUP.md](MONGODB_ATLAS_SETUP.md)

---

## Support

**Issues?** Check:
1. Connection string format in `.env`
2. MongoDB Atlas IP whitelist (0.0.0.0/0)
3. Database user credentials
4. Backend logs for detailed error messages
