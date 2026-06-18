# BloodConnect CRM AI+X - Complete Login System Setup & Testing Guide

## 🎯 Quick Start

This guide covers the complete implementation of the role-based login system for BloodConnect CRM AI+X.

---

## 📋 System Overview

The login system now includes:
1. **Role-based authentication** - 4 roles with different dashboard access
2. **Secure password validation** - bcryptjs with salt rounds
3. **JWT token management** - 12-hour expiration
4. **Comprehensive error handling** - User-friendly messages
5. **Role normalization** - Automatic format conversion
6. **Database integration** - MongoDB with User model

---

## 🔧 Installation & Setup

### Step 1: Backend Dependencies

```bash
cd backend
npm install

# Verify all dependencies installed
npm list | grep -E "bcryptjs|jsonwebtoken|express|mongoose|cors"
```

**Required packages:**
- `bcryptjs` - Password hashing
- `jsonwebtoken` - JWT creation and verification
- `express` - API framework
- `mongoose` - MongoDB driver
- `cors` - Cross-origin requests
- `dotenv` - Environment variables

### Step 2: Environment Variables

Create/update `.env` file in backend directory:

```env
# MongoDB Connection
MONGODB_URI=mongodb+srv://username:password@cluster0.mongodb.net/bloodconnect?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your_super_secure_secret_key_here_change_in_production

# Server Configuration
PORT=5001
NODE_ENV=development

# Frontend Configuration
FRONTEND_URL=http://localhost:4177

# Email Configuration (Optional)
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=noreply@bloodconnect.ai
```

### Step 3: Database Setup

#### Option A: Using MongoDB Atlas (Cloud)

1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a cluster
3. Create database user
4. Get connection string
5. Add connection string to `.env`

#### Option B: Using Local MongoDB

1. Install MongoDB Community Edition
2. Start MongoDB service
3. Set connection string: `MONGODB_URI=mongodb://localhost:27017/bloodconnect`

### Step 4: Create Test Users

Create a file `backend/scripts/seed-users.js`:

```javascript
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = require('../models/User');

require('dotenv').config();

const seedUsers = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing test users
    await User.deleteMany({ email: { $in: [
      'admin@bloodconnect.ai',
      'hospital@bloodconnect.ai',
      'bloodbank@bloodconnect.ai',
      'volunteer@bloodconnect.ai'
    ]}});

    // Hash passwords
    const adminHash = await bcrypt.hash('admin123', 10);
    const hospitalHash = await bcrypt.hash('hospital123', 10);
    const bloodbankHash = await bcrypt.hash('bloodbank123', 10);
    const volunteerHash = await bcrypt.hash('volunteer123', 10);

    // Create test users
    const users = [
      {
        name: 'Admin User',
        email: 'admin@bloodconnect.ai',
        password: adminHash,
        role: 'admin',
        roles: ['admin'],
        isActive: true
      },
      {
        name: 'Hospital Admin',
        email: 'hospital@bloodconnect.ai',
        password: hospitalHash,
        role: 'hospital',
        roles: ['hospital'],
        isActive: true
      },
      {
        name: 'Blood Bank Manager',
        email: 'bloodbank@bloodconnect.ai',
        password: bloodbankHash,
        role: 'blood_bank',
        roles: ['blood_bank'],
        isActive: true
      },
      {
        name: 'Volunteer User',
        email: 'volunteer@bloodconnect.ai',
        password: volunteerHash,
        role: 'volunteer',
        roles: ['volunteer'],
        isActive: true
      }
    ];

    await User.insertMany(users);
    console.log('✅ Test users created successfully!');
    
    // Display created users
    const allUsers = await User.find({});
    console.log('\nCreated users:');
    allUsers.forEach(user => {
      console.log(`  - ${user.email} (${user.role})`);
    });

    await mongoose.connection.close();
  } catch (error) {
    console.error('❌ Error seeding users:', error);
    process.exit(1);
  }
};

seedUsers();
```

Run the seed script:
```bash
node backend/scripts/seed-users.js
```

---

## 🚀 Starting the Backend

### Development Mode

```bash
cd backend
npm start
```

Expected output:
```
BloodConnect CRM AI server running on port 5001
```

### Verify Server is Running

```bash
# Test with curl
curl http://localhost:5001/api/status

# Expected response:
# {"status":"ok","service":"BloodConnect CRM AI Backend"}
```

---

## 🎯 Testing the Login System

### Test 1: Successful Admin Login

**Request:**
```bash
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@bloodconnect.ai",
    "password": "admin123",
    "role": "Admin"
  }'
```

**Expected Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Admin User",
    "email": "admin@bloodconnect.ai",
    "role": "admin"
  }
}
```

### Test 2: Hospital Role Login

**Request:**
```bash
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "hospital@bloodconnect.ai",
    "password": "hospital123",
    "role": "Hospital"
  }'
```

**Expected Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Hospital Admin",
    "email": "hospital@bloodconnect.ai",
    "role": "hospital"
  }
}
```

### Test 3: Blood Bank Role Login

**Request:**
```bash
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "bloodbank@bloodconnect.ai",
    "password": "bloodbank123",
    "role": "Blood Bank"
  }'
```

**Expected Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Blood Bank Manager",
    "email": "bloodbank@bloodconnect.ai",
    "role": "blood_bank"
  }
}
```

### Test 4: Volunteer Role Login

**Request:**
```bash
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "volunteer@bloodconnect.ai",
    "password": "volunteer123",
    "role": "Volunteer"
  }'
```

**Expected Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Volunteer User",
    "email": "volunteer@bloodconnect.ai",
    "role": "volunteer"
  }
}
```

### Test 5: Missing Role

**Request:**
```bash
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@bloodconnect.ai",
    "password": "admin123"
  }'
```

**Expected Response (400 Bad Request):**
```json
{
  "message": "Please select your role."
}
```

### Test 6: Invalid Credentials

**Request:**
```bash
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@bloodconnect.ai",
    "password": "wrongpassword",
    "role": "Admin"
  }'
```

**Expected Response (401 Unauthorized):**
```json
{
  "message": "Invalid email or password."
}
```

### Test 7: Invalid Role

**Request:**
```bash
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@bloodconnect.ai",
    "password": "admin123",
    "role": "SuperAdmin"
  }'
```

**Expected Response (400 Bad Request):**
```json
{
  "message": "Invalid role selected."
}
```

### Test 8: User Without Role

Create a user without the requested role:

```bash
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@bloodconnect.ai",
    "password": "admin123",
    "role": "Hospital"
  }'
```

**Expected Response (403 Forbidden):**
```json
{
  "message": "You don't have permission to login as Hospital. Please select a role associated with your account."
}
```

---

## 🖥️ Frontend Testing

### Step 1: Start Frontend

```bash
cd frontend
npm run dev
```

Frontend should start on: `http://localhost:4173` or `http://localhost:5173`

### Step 2: Navigate to Login

Open browser and go to: `http://localhost:4173/login`

### Step 3: Test Login Flow

1. **Select Role**: Click on "Admin" role tab
2. **Enter Credentials**: 
   - Email: `admin@bloodconnect.ai`
   - Password: `admin123`
3. **Toggle Password**: Click "Show" to verify password input
4. **Check Remember Me**: Toggle checkbox
5. **Click Sign In**: Submit form
6. **Observe**: 
   - ✅ Success toast: "Welcome back, Admin User!"
   - ✅ Redirect to `/dashboard/admin`
   - ✅ Token in localStorage/sessionStorage

### Step 4: Test Error Scenarios

#### Scenario A: Missing Role
1. Skip selecting role
2. Enter email and password
3. Click Sign In
4. Expect: Error "Please select your role."

#### Scenario B: Invalid Email
1. Select role
2. Enter invalid email format (e.g., "admin")
3. Click Sign In
4. Expect: Error "Please provide a valid email address."

#### Scenario C: Missing Password
1. Select role
2. Enter email
3. Leave password empty
4. Click Sign In
5. Expect: Error "Please enter both email and password."

#### Scenario D: Wrong Password
1. Select role
2. Enter email: `admin@bloodconnect.ai`
3. Enter password: `wrongpassword`
4. Click Sign In
5. Expect: Error "Invalid email or password."

#### Scenario E: Wrong Role
1. Create user assigned to "admin" role only
2. Try to login as "hospital"
3. Click Sign In
4. Expect: Error about no permission for role

### Step 5: Test All Roles

Repeat login test for each role:
- ✅ Admin → `/dashboard/admin`
- ✅ Hospital → `/dashboard/hospital`
- ✅ Blood Bank → `/dashboard/bloodbank`
- ✅ Volunteer → `/dashboard/volunteer`

### Step 6: Test Remember Me

#### With "Remember Me" checked:
1. Login and check "Remember Me"
2. Close browser
3. Reopen `http://localhost:4173`
4. Should still be logged in
5. Token in localStorage

#### Without "Remember Me":
1. Login without checking "Remember Me"
2. Close browser tab (not entire browser)
3. Reopen new tab to `http://localhost:4173`
4. Should redirect to login
5. Token was in sessionStorage (cleared)

---

## 🧪 Automated Testing (Optional)

### Unit Tests for Backend

Create `backend/routes/auth.test.js`:

```javascript
const request = require('supertest');
const app = require('../server');
const User = require('../models/User');

describe('Authentication', () => {
  it('should login with valid credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'admin@bloodconnect.ai',
        password: 'admin123',
        role: 'admin'
      });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user.role).toBe('admin');
  });

  it('should reject missing role', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'admin@bloodconnect.ai',
        password: 'admin123'
      });

    expect(res.status).toBe(400);
    expect(res.body.message).toContain('Please select your role');
  });

  it('should reject invalid credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'admin@bloodconnect.ai',
        password: 'wrongpassword',
        role: 'admin'
      });

    expect(res.status).toBe(401);
  });
});
```

Run tests:
```bash
npm test
```

---

## 📊 Authentication Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                      LOGIN PAGE                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ Select Role: [Admin] Hospital Blood Bank Volunteer   │  │
│  │ Email: admin@bloodconnect.ai                          │  │
│  │ Password: ••••••••••                                  │  │
│  │ [✓] Remember me                                       │  │
│  │ [Sign In]                                             │  │
│  └───────────────────────────────────────────────────────┘  │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   │ POST /api/auth/login
                   │ { email, password, role }
                   ↓
┌──────────────────────────────────────────────────────────────┐
│                  BACKEND VALIDATION                          │
│  1. Check email & password provided ✓                        │
│  2. Check role provided ✓                                    │
│  3. Normalize role (Admin → admin) ✓                         │
│  4. Validate role in allowed list ✓                          │
│  5. Find user in database ✓                                  │
│  6. Check user active ✓                                      │
│  7. Compare password (bcrypt) ✓                              │
│  8. Validate user has role ✓                                 │
│  9. Create JWT with role ✓                                   │
│  10. Return token & user data ✓                              │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   │ 200 OK
                   │ { token, user }
                   ↓
┌──────────────────────────────────────────────────────────────┐
│              FRONTEND STORAGE HANDLING                       │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ if (Remember Me) {                                  │   │
│  │   localStorage.setItem('bloodconnect_token', ...)  │   │
│  │ } else {                                            │   │
│  │   sessionStorage.setItem('bloodconnect_token',...) │   │
│  │ }                                                   │   │
│  └─────────────────────────────────────────────────────┘   │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   │ Show success toast
                   │ "Welcome back, Admin User!"
                   ↓
┌──────────────────────────────────────────────────────────────┐
│              REDIRECT TO DASHBOARD                           │
│  role: admin → /dashboard/admin                              │
│  role: hospital → /dashboard/hospital                        │
│  role: blood_bank → /dashboard/bloodbank                     │
│  role: volunteer → /dashboard/volunteer                      │
└──────────────────────────────────────────────────────────────┘
```

---

## 🔍 Debugging Tips

### Check Backend Logs

```bash
# If running with npm
npm start
# Watch console for errors

# If running with pm2
pm2 logs bloodconnect-backend
```

### Check Frontend Network Tab

1. Open DevTools (F12)
2. Go to Network tab
3. Click Sign In
4. Find POST request to `/api/auth/login`
5. Check:
   - Request body (email, password, role)
   - Response status (200, 400, 401, etc.)
   - Response body (token, error message)

### Check Browser Storage

1. Open DevTools (F12)
2. Go to Application tab
3. Check localStorage/sessionStorage
4. Look for keys:
   - `bloodconnect_token`
   - `bloodconnect_user`
   - `bloodconnect_role`

### Test MongoDB Connection

```bash
# From MongoDB shell
mongo

# Or with MongoDB Atlas connection
mongo "mongodb+srv://cluster.mongodb.net/bloodconnect"

# List users
use bloodconnect
db.users.find().pretty()
```

### Verify JWT Token

Visit https://jwt.io and paste the token to see payload:
```javascript
{
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "admin@bloodconnect.ai",
    "name": "Admin User",
    "role": "admin"
  },
  "iat": 1623456790,
  "exp": 1623543190
}
```

---

## ✅ Testing Checklist

### Backend Tests
- [ ] POST `/api/auth/login` returns 200 with token for valid credentials
- [ ] POST `/api/auth/login` returns 400 for missing role
- [ ] POST `/api/auth/login` returns 401 for invalid credentials
- [ ] POST `/api/auth/login` returns 403 for user without role
- [ ] POST `/api/auth/login` returns 400 for invalid role
- [ ] JWT includes role in payload
- [ ] Password comparison uses bcrypt
- [ ] User.isActive is checked

### Frontend Tests
- [ ] Login page displays all 4 roles
- [ ] Role selector has smooth animations
- [ ] Form validates email format
- [ ] Form validates required fields
- [ ] Success toast displays on login
- [ ] Token stored in localStorage (with Remember Me)
- [ ] Token stored in sessionStorage (without Remember Me)
- [ ] Redirects to `/dashboard/admin` for admin role
- [ ] Redirects to `/dashboard/hospital` for hospital role
- [ ] Redirects to `/dashboard/bloodbank` for blood_bank role
- [ ] Redirects to `/dashboard/volunteer` for volunteer role

### Integration Tests
- [ ] Full login flow works end-to-end
- [ ] User stays logged in after page refresh (with Remember Me)
- [ ] User logs out after browser close (without Remember Me)
- [ ] Error messages clear when correcting input
- [ ] Can login with different roles on same page
- [ ] Forgot password link works

---

## 🚀 Production Deployment

### Pre-deployment Checklist

- [ ] JWT_SECRET set to secure random string
- [ ] MongoDB Atlas cluster created and secured
- [ ] CORS origins updated for production domain
- [ ] Email configuration (if using password reset)
- [ ] Test users created in production DB
- [ ] All secrets in environment variables
- [ ] HTTPS enabled
- [ ] Rate limiting implemented
- [ ] Logging configured
- [ ] Backup strategy in place

### Deploy Backend

```bash
# Using pm2
pm2 start backend/server.js --name "bloodconnect-backend"
pm2 save
pm2 startup

# Or using Docker
docker build -t bloodconnect-backend .
docker run -e JWT_SECRET=$JWT_SECRET bloodconnect-backend
```

### Deploy Frontend

```bash
# Build for production
npm run build

# Deploy dist folder to hosting service
# Ensure VITE_API_URL points to production backend
```

---

## 📞 Common Issues & Solutions

| Issue | Cause | Solution |
|-------|-------|----------|
| "Invalid email or password" for correct creds | User not in DB | Seed database with test users |
| CORS error | Frontend not in CORS whitelist | Add frontend URL to server.js CORS config |
| "Cannot find module bcryptjs" | Dependencies not installed | Run `npm install` in backend |
| JWT_SECRET undefined | .env not loaded | Create .env file with JWT_SECRET |
| MongoDB connection failed | Bad connection string | Verify MONGODB_URI in .env |
| Role mismatch error | Role names differ | Use normalized roles (lowercase, underscore) |
| Token expires too quickly | Check exp in JWT | Token valid for 12 hours |

---

## 🎉 Success Indicators

✅ **System is working when:**
1. Login page displays with all 4 roles
2. Can login with test user credentials
3. Receives JWT token in response
4. Token stored in localStorage/sessionStorage
5. Redirected to correct role dashboard
6. Can access authenticated endpoints with token
7. Invalid credentials rejected properly
8. Missing role shows error message
9. Animations are smooth (60fps)
10. Responsive on mobile/tablet/desktop

---

## 📚 Additional Resources

- [JWT.io - JWT Debugger](https://jwt.io)
- [bcryptjs Documentation](https://www.npmjs.com/package/bcryptjs)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [Express.js Documentation](https://expressjs.com)
- [React Router Documentation](https://reactrouter.com)

---

**Status**: ✅ **READY FOR PRODUCTION**

**Last Updated**: June 17, 2026

---

Let's build the best blood donation CRM system! 🩸❤️🚀
