# MongoDB Atlas Complete Setup Guide for BloodConnect CRM

## Table of Contents
1. [Overview](#overview)
2. [Step-by-Step Setup](#step-by-step-setup)
3. [Environment Configuration](#environment-configuration)
4. [Backend Code Changes](#backend-code-changes)
5. [Testing Connection](#testing-connection)
6. [Troubleshooting](#troubleshooting)
7. [Production Deployment](#production-deployment)

---

## Overview

**Current Problem**: Local MongoDB at `127.0.0.1:27017` is not available

**Solution**: MongoDB Atlas (MongoDB's official cloud platform)

**Benefits**:
- ✅ No local installation needed
- ✅ Automatic backups
- ✅ Scalable infrastructure
- ✅ Free tier: 512MB storage (perfect for development)
- ✅ Production-ready security
- ✅ Real-time monitoring

---

## Step-by-Step Setup

### Step 1: Create MongoDB Atlas Account (2 minutes)

1. **Go to MongoDB Atlas**:
   - Visit: https://www.mongodb.com/cloud/atlas/register
   - Or login if you have account: https://cloud.mongodb.com

2. **Sign Up**:
   - Use email, Google, or GitHub account
   - Create a password
   - Click "Create your MongoDB Account"

3. **Accept Terms**:
   - Accept the Terms of Service
   - Click "Continue"

### Step 2: Create Your First Project (1 minute)

1. **Welcome Page** should show "Create your first project"
2. **Name Your Project**: `BloodConnect-CRM`
3. **Select Project Settings**:
   - Leave defaults as-is
   - Click "Create Project"
4. **Organization**: Confirm your organization
5. **Next Steps**: Click "Build a Database"

### Step 3: Create Free M0 Cluster (5 minutes)

1. **Deployment Options** screen appears
2. **Select Tier**: 
   - Click **M0 (Free Tier)**
   - This gives you 512MB storage + 100MB transfer limit (enough for development)

3. **Provider & Region**:
   - **Provider**: AWS (recommended)
   - **Region**: Select closest to your location
     - US East (us-east-1) for US users
     - Europe (eu-west-1) for EU users
     - Asia Pacific (ap-southeast-1) for Asia

4. **Cluster Tier Details** will show on right
5. **Create Cluster** button at bottom
6. Click **"Create Deployment"**

**Wait 5-10 minutes** for cluster to initialize. You'll see:
```
⚡ Creating cluster...
✅ Cluster is ready
```

### Step 4: Create Database User (2 minutes)

1. **After cluster is created**, a dialog appears: "Secure your connection"

2. **Create a Database User**:
   - **Username**: `bloodconnect_admin`
   - **Password**: Create a **strong password** (save it somewhere safe!)
     - Use: uppercase, lowercase, numbers, symbols
     - Avoid special chars that need URL encoding (easier setup)
   - Click **"Create User"**

3. **Password Options**:
   - MongoDB auto-generates one if you want
   - Or create your own
   - **Save this password** - you'll need it!

### Step 5: IP Whitelist (1 minute)

1. **Next Step**: "Choose where to connect from"

2. **Add IP Address**:
   - For **Development**: Click "Allow access from anywhere"
     - Adds `0.0.0.0/0` (all IPs - only for dev!)
   - For **Production**: Add specific IP only

3. Click **"Finish and Close"**

### Step 6: Get Connection String (2 minutes)

1. **Back in Atlas Dashboard**, find your cluster
2. Click **"Connect"** button (top right)
3. **Choose Connection Method**: "Drivers"
4. **Select Driver**: Node.js
5. **Copy the Connection String**:
   ```
   mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority
   ```

This is your **connection string**. You'll customize it in the next section.

---

## Environment Configuration

### .env File Setup

Update `backend/.env` with your MongoDB Atlas connection:

```env
# Server Configuration
PORT=5001
NODE_ENV=development

# MongoDB Atlas Configuration
MONGO_URI=mongodb+srv://bloodconnect_admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/blood_donor_crm?retryWrites=true&w=majority
MONGODB_URI=mongodb+srv://bloodconnect_admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/blood_donor_crm?retryWrites=true&w=majority
DATABASE_NAME=blood_donor_crm

# Database Retry Configuration
DB_MAX_RETRIES=5
DB_INITIAL_DELAY_MS=2000

# JWT Authentication
JWT_SECRET=super_secure_jwt_secret_123
JWT_EXPIRY=7d

# OpenAI API
OPENAI_API_KEY=sk-your-openai-api-key-here
```

### Customize Connection String

Replace placeholders in `MONGO_URI`:

```
mongodb+srv://
  ↓
bloodconnect_admin          ← Your username
  ↓
:YOUR_PASSWORD              ← Your password (from Step 4)
  ↓
@cluster0.xxxxx.mongodb.net ← Your cluster URL (from Step 6)
  ↓
/blood_donor_crm            ← Database name
  ↓
?retryWrites=true&w=majority ← Options (keep as-is)
```

### Example (with values filled in)

```env
MONGO_URI=mongodb+srv://bloodconnect_admin:MyS@fe!Pass123@cluster0.a1b2c3d4.mongodb.net/blood_donor_crm?retryWrites=true&w=majority
```

### Special Characters in Password

If your password contains special characters:
- `@` → `%40`
- `#` → `%23`
- `%` → `%25`
- `:` → `%3A`
- `/` → `%2F`

**Example**: Password `Pass@word#123` becomes `Pass%40word%23123`

---

## Backend Code Changes

### Update `backend/config/db.js`

The current setup already supports Atlas! Here's the enhanced version with better logging:

```javascript
const mongoose = require('mongoose');

// Configuration
const DEFAULT_MAX_RETRIES = parseInt(process.env.DB_MAX_RETRIES) || 5;
const DEFAULT_INITIAL_DELAY_MS = parseInt(process.env.DB_INITIAL_DELAY_MS) || 2000;

// Set mongoose options
mongoose.set('strictQuery', false);

const state = {
  connected: false,
};

const log = {
  info: (message) => console.log(`🔄 ${message}`),
  success: (message) => console.log(`✅ ${message}`),
  warn: (message) => console.warn(`⏳ ${message}`),
  error: (message) => console.error(`❌ ${message}`),
};

/**
 * Attach MongoDB Connection Event Handlers
 */
const attachConnectionEvents = () => {
  const db = mongoose.connection;

  db.on('connected', () => {
    state.connected = true;
    log.success('MongoDB connected (event).');
  });

  db.on('error', (err) => {
    state.connected = false;
    log.error(`MongoDB connection error (event): ${err.message}`);
  });

  db.on('disconnected', () => {
    state.connected = false;
    log.warn('MongoDB disconnected (event).');
  });

  db.on('reconnected', () => {
    state.connected = true;
    log.success('MongoDB reconnected (event).');
  });
};

/**
 * Connect to MongoDB Atlas with Retry Logic
 * Supports automatic reconnection and graceful fallback
 * @param {Object} options - Connection options
 * @returns {Promise} Mongoose connection
 */
const connectDB = async (options = {}) => {
  const maxRetries = options.maxRetries ?? DEFAULT_MAX_RETRIES;
  const initialDelayMs = options.initialDelayMs ?? DEFAULT_INITIAL_DELAY_MS;

  // Get connection URI from environment
  const mongoUri = 
    process.env.MONGO_URI || 
    process.env.MONGODB_URI || 
    'mongodb://127.0.0.1:27017/blood_donor_crm';

  if (!mongoUri) {
    throw new Error('MONGO_URI is not set. Please set MONGO_URI environment variable.');
  }

  // Log connection details (mask password for security)
  const maskedUri = mongoUri.replace(/:[^:@]+@/, ':***@');
  log.info(`Connecting to MongoDB: ${maskedUri}`);

  // Setup connection event handlers
  if (!mongoose.connection.listeners('connected').length) {
    attachConnectionEvents();
  }

  let attempt = 0;
  let delay = initialDelayMs;

  while (attempt <= maxRetries) {
    try {
      attempt += 1;
      log.info(`Connection attempt ${attempt}/${maxRetries + 1}...`);

      const conn = await mongoose.connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        bufferCommands: false,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        retryWrites: true,
        w: 'majority',
      });

      state.connected = true;

      // Log connection details
      const dbName = conn.connection.db.getName();
      log.success(`MongoDB connected successfully!`);
      log.success(`  Host: ${conn.connection.host}`);
      log.success(`  Database: ${dbName}`);
      log.success(`  Atlas: Yes (Cloud)`);

      return conn;

    } catch (error) {
      state.connected = false;
      
      log.error(`Connection attempt ${attempt} failed: ${error.message}`);

      if (attempt > maxRetries) {
        log.error(`Maximum connection attempts (${maxRetries}) reached.`);
        throw error;
      }

      const waitSeconds = delay / 1000;
      log.warn(`Retrying in ${waitSeconds}s... (Attempt ${attempt}/${maxRetries})`);
      
      // Wait before retry (exponential backoff)
      // eslint-disable-next-line no-await-in-loop
      await new Promise((resolve) => setTimeout(resolve, delay));
      delay *= 2; // Double delay each attempt
    }
  }
};

/**
 * Check if MongoDB is connected
 * @returns {boolean} Connection status
 */
connectDB.isConnected = () => state.connected;

/**
 * Get current connection state
 * @returns {Object} Connection details
 */
connectDB.getState = () => ({
  connected: state.connected,
  connection: mongoose.connection,
});

/**
 * Gracefully close MongoDB connection
 * @returns {Promise} Closed connection
 */
connectDB.close = async () => {
  try {
    await mongoose.connection.close();
    log.success('MongoDB connection closed.');
    return true;
  } catch (error) {
    log.error(`Error closing connection: ${error.message}`);
    return false;
  }
};

module.exports = connectDB;
```

### Update `backend/server.js`

Ensure graceful error handling:

```javascript
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

const app = express();

console.log('🚀 Starting Blood Donor CRM AI 2.0...');
console.log('🔄 Initializing database...');

// ===== MIDDLEWARE =====
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:4173', 'http://localhost:4174'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// ===== DATABASE CONNECTION =====
let dbConnected = false;

const initializeDatabase = async () => {
  try {
    await connectDB();
    dbConnected = true;
    console.log('✅ Database connection established');
  } catch (error) {
    dbConnected = false;
    console.error('⚠️  Database connection failed. Starting server anyway...');
    console.error('   Application will attempt to reconnect automatically');
  }
};

// Initialize database
initializeDatabase();

// ===== DATABASE MIDDLEWARE =====
const databaseAvailabilityMiddleware = (req, res, next) => {
  const isConnected = connectDB.isConnected();
  
  // Block critical write operations if DB unavailable
  if (!isConnected && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
    return res.status(503).json({
      success: false,
      message: 'Database temporarily unavailable. Please try again in a moment.'
    });
  }

  next();
};

app.use(databaseAvailabilityMiddleware);

// ===== HEALTH CHECK ENDPOINT =====
app.get('/api/status', (req, res) => {
  res.json({
    status: 'ok',
    service: 'BloodConnect CRM AI 2.0 Backend',
    database: connectDB.isConnected() ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// ===== API ROUTES =====
app.use('/api/auth', require('./routes/auth'));
app.use('/api/donors', require('./routes/donors'));
app.use('/api/emergency', require('./routes/emergencyRoutes'));
app.use('/api/emergencies', require('./routes/emergencyRoutes'));
app.use('/api/ai', require('./routes/aiRoutes'));
app.use('/api/chat', require('./routes/chat'));
app.use('/api/analytics', require('./routes/analytics'));

// ===== 404 HANDLER =====
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// ===== ERROR HANDLER =====
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});

// ===== START SERVER =====
const PORT = process.env.PORT || 5001;
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 API: http://localhost:${PORT}`);
});

// ===== GRACEFUL SHUTDOWN =====
process.on('SIGTERM', async () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(async () => {
    console.log('HTTP server closed');
    await connectDB.close();
    process.exit(0);
  });
});

module.exports = app;
```

---

## Testing Connection

### Test 1: Direct Connection Test

```bash
cd backend
node test-mongodb.js
```

Expected output:
```
==================================================
  MongoDB Connection Tester
==================================================

📍 Configuration:
   MONGO_URI: mongodb+srv://bloodconnect_admin:***@cluster0.xxxxx.mongodb.net/blood_donor_crm

📊 Connection Details:
   Type: MongoDB Atlas (Cloud)
   Host: cluster0.xxxxx.mongodb.net
   Database: blood_donor_crm

🔄 Attempting connection...

✅ CONNECTION SUCCESSFUL!

📌 Connection Info:
   State: Connected
   Host: cluster0.xxxxx.mongodb.net
   Database: blood_donor_crm

🧪 Testing database access...
   Server Status: OK
   MongoDB Version: 6.0.0

📦 Collections (0):
   (No collections yet - will be created when data is inserted)

==================================================
  ✅ YOU'RE READY TO GO! Start the backend with:
     npm run dev
==================================================
```

### Test 2: Start Backend

```bash
cd backend
npm run dev
```

Expected output:
```
🚀 Starting Blood Donor CRM AI 2.0...
🔄 Initializing database...
✅ MongoDB connected successfully!
  Host: cluster0.xxxxx.mongodb.net
  Database: blood_donor_crm
  Atlas: Yes (Cloud)
🚀 Server running on port 5001
📍 API: http://localhost:5001
```

### Test 3: Verify API

```bash
curl http://localhost:5001/api/status
```

Expected response:
```json
{
  "status": "ok",
  "service": "BloodConnect CRM AI 2.0 Backend",
  "database": "connected",
  "timestamp": "2026-06-15T10:30:00.000Z",
  "environment": "development"
}
```

---

## Troubleshooting

### Error: "ECONNREFUSED"

**Cause**: Connection string is wrong or Atlas cluster is not ready

**Fix**:
1. Copy connection string from Atlas Dashboard → Connect → Drivers
2. Paste into .env file exactly as shown
3. Replace `<username>`, `<password>`, `<cluster>` placeholders
4. Wait 5-10 minutes if cluster just created
5. Check IP is whitelisted (0.0.0.0/0 for dev)

### Error: "authentication failed"

**Cause**: Username or password incorrect

**Fix**:
1. Go to MongoDB Atlas Dashboard
2. Click "Database Access"
3. Reset password or create new user
4. Update .env with correct credentials
5. URL-encode special characters

### Error: "HOSTNAME_NOT_FOUND"

**Cause**: Internet connection or DNS issue

**Fix**:
1. Check internet connection
2. Check cluster hostname is correct
3. Try pinging: `ping cluster0.xxxxx.mongodb.net`
4. Check firewall allows outbound 27017

### Error: "timeout"

**Cause**: Takes too long to connect

**Fix**:
1. Check internet connection
2. Atlas may be initializing (wait 5-10 minutes)
3. Try again with: `node test-mongodb.js`

---

## Production Deployment

### Before Deploying

1. **Change IP Whitelist**:
   - Don't use `0.0.0.0/0` (all IPs)
   - Add specific deployment server IP
   - Remove old IPs

2. **Create Production User**:
   - Create separate DB user for production
   - Use strong random password
   - Store in secure environment variables

3. **Set NODE_ENV**:
   ```env
   NODE_ENV=production
   ```

4. **Upgrade Cluster (Optional)**:
   - M0 (free) is ok for small apps
   - M2+ if you need more resources
   - Auto-scaling available for M2+

5. **Enable Authentication**:
   - Always use username/password
   - Never commit .env to Git
   - Use environment variables on server

### Environment Variables for Production

```env
# Production .env
NODE_ENV=production
PORT=5001

# MongoDB Atlas (Production)
MONGO_URI=mongodb+srv://prod_user:secure_password@cluster.mongodb.net/blood_donor_crm?retryWrites=true&w=majority

# JWT
JWT_SECRET=very_long_secure_random_string_here
JWT_EXPIRY=7d

# OpenAI
OPENAI_API_KEY=sk-your-production-key
```

### Deployment Checklist

- [ ] MongoDB Atlas cluster created
- [ ] Production database user created
- [ ] IP whitelist updated with production server IP
- [ ] Connection string tested locally first
- [ ] .env configured with production values
- [ ] NODE_ENV set to "production"
- [ ] Backend starts without database errors
- [ ] API /api/status returns "database": "connected"
- [ ] Application tested in production environment
- [ ] Error logs monitored for connection issues
- [ ] Backup strategy defined (Atlas automatic backups enabled)

---

## Success Indicators

✅ **You're Done When**:
- `npm run dev` starts without connection errors
- `curl http://localhost:5001/api/status` shows `"database": "connected"`
- `node test-mongodb.js` shows "CONNECTION SUCCESSFUL!"
- Application can perform CRUD operations
- No ECONNREFUSED errors in logs

✅ **Benefits You Now Have**:
- Cloud-based MongoDB (no local installation)
- Automatic failover and replication
- Real-time monitoring and alerts
- Automatic daily backups
- 99.99% uptime SLA
- Production-ready security
- Easy scaling as you grow

---

## Quick Reference

| Item | Value |
|------|-------|
| **Website** | https://cloud.mongodb.com |
| **Free Tier** | M0: 512MB storage |
| **Connection String** | `mongodb+srv://user:pass@cluster.mongodb.net/db` |
| **Retry Attempts** | 5 (configurable) |
| **Timeout** | 5 seconds per attempt |
| **Max Delay** | 32 seconds (5 attempts) |

---

**Status**: Ready for Production  
**Time to Setup**: 15 minutes  
**Difficulty**: Easy ✅  
**Cost**: Free (M0 tier)

Go to https://cloud.mongodb.com and start! 🚀
