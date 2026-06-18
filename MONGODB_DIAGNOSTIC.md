# MongoDB Connection Diagnostic Report
**Generated**: 2026-06-15  
**Issue**: ECONNREFUSED 127.0.0.1:27017

## Diagnosis Summary

| Check | Status | Details |
|-------|--------|---------|
| **MongoDB Service** | ❌ NOT INSTALLED | No MongoDB service found |
| **mongod Process** | ❌ NOT RUNNING | Process not found in system |
| **Port 27017** | ❌ NOT LISTENING | Port not in use |
| **Installation Path** | ❌ NOT FOUND | Default location empty |
| **mongod Executable** | ❌ NOT FOUND | Command not in PATH |
| **MONGO_URI Config** | ✅ CORRECT | mongodb://127.0.0.1:27017/blood_donor_crm |
| **Environment File** | ✅ EXISTS | .env properly configured |

## Root Cause
**MongoDB is not installed on this system.**

The backend is configured to connect to a local MongoDB instance on localhost:27017, but MongoDB server is not installed or running.

---

## Solution Options

### Option 1: Install MongoDB Community Edition (Recommended for Development)

#### Step 1: Download MongoDB
1. Visit: https://www.mongodb.com/try/download/community
2. Select:
   - **Version**: Latest (6.0 or higher)
   - **Platform**: Windows x64
   - **Package**: MSI
3. Click "Download" and save the installer

#### Step 2: Run MongoDB Installer
1. Double-click the downloaded MSI file
2. Follow the MongoDB Setup Wizard:
   - Accept license agreement
   - Choose "Complete" installation
   - Click "Install"
   - Leave "Run the MongoDB service as Admin" checked (recommended)
3. MongoDB will install and start automatically

#### Step 3: Verify Installation
```powershell
# Check if service is running
Get-Service MongoDB -ErrorAction SilentlyContinue

# Should show: Status: Running
```

#### Step 4: Test Connection
```powershell
# This will show the MongoDB shell prompt
mongosh
```

If you see `test>` prompt, MongoDB is working!

#### Step 5: Create Data Directory (if needed)
```powershell
# Default MongoDB data directory
$dbpath = "C:\data\db"
if (!(Test-Path $dbpath)) { New-Item -ItemType Directory -Path $dbpath -Force }
```

---

### Option 2: Start MongoDB Manually (Without Service)

#### Step 1: Create Data Directory
```powershell
$dbpath = "$env:USERPROFILE\mongodb\data"
New-Item -ItemType Directory -Path $dbpath -Force
```

#### Step 2: Find mongod Executable
```powershell
# If installed via MSI, typically at:
$mongod = "C:\Program Files\MongoDB\Server\6.0\bin\mongod.exe"

# Verify it exists
Test-Path $mongod
```

#### Step 3: Start MongoDB Server
```powershell
# Start in new PowerShell window
& "C:\Program Files\MongoDB\Server\6.0\bin\mongod.exe" --dbpath "$env:USERPROFILE\mongodb\data"

# Or use a command shortcut
mongod --dbpath "$env:USERPROFILE\mongodb\data"
```

You should see output like:
```
{"t":{"$date":"2026-06-15T..."},"s":"I","msg":"Waiting for connections","attr":{"port":27017}}
```

#### Step 4: Keep This Terminal Open
The MongoDB server runs in this terminal. Don't close it while developing.

#### Step 5: In New Terminal, Start Backend
```powershell
cd "C:\Users\hp5cd\blood donar crm\backend"
npm run dev
```

---

### Option 3: Use MongoDB Atlas (Cloud - No Installation)

MongoDB Atlas is free for development and doesn't require local installation.

#### Step 1: Create Account
1. Visit: https://www.mongodb.com/cloud/atlas
2. Click "Start Free"
3. Sign up with email/Google/GitHub

#### Step 2: Create Cluster
1. Create a new project (default name OK)
2. Build a cluster:
   - **Provider**: AWS (or your preference)
   - **Region**: Closest to you
   - **Tier**: M0 (free tier) - recommended
3. Click "Create Cluster" and wait 5-10 minutes

#### Step 3: Create Database User
1. In cluster dashboard, go to **Database Access**
2. Click "Add New Database User"
3. Create username and password (save these!)
4. Add IP whitelist (or allow all: 0.0.0.0/0 for development)

#### Step 4: Get Connection String
1. Go to **Clusters** section
2. Click "Connect" button
3. Choose "Connect your application"
4. Copy the connection string:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/database
   ```

#### Step 5: Update .env File
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/blood_donor_crm
```

Replace:
- `username` - your database user
- `password` - your password (URL encode special chars: @ → %40, # → %23, etc.)
- `cluster` - your cluster name

#### Step 6: Test Connection
```powershell
cd "C:\Users\hp5cd\blood donar crm\backend"
npm run dev
```

---

## Quick Fix Commands

### If MongoDB is Already Installed Locally

#### Check Service Status
```powershell
# Check if service exists and its status
Get-Service MongoDB | Select-Object Name, Status

# If stopped, start it
Start-Service MongoDB

# Enable auto-start
Set-Service MongoDB -StartupType Automatic
```

#### Start MongoDB Manually
```powershell
# Find mongod
$mongod = (Get-Command mongod -ErrorAction SilentlyContinue).Source
& $mongod --dbpath "C:\data\db"
```

#### Verify Connection
```powershell
# Check if port is listening
netstat -ano | findstr "27017"

# If something shows, MongoDB is running!
```

---

## Recommended Path Forward

### For Quick Development:
1. **Install MongoDB Community** (Option 1, fastest)
   - One-time setup
   - Full local control
   - No cloud account needed

### For Production/Team Development:
2. **Use MongoDB Atlas** (Option 3)
   - Already provided connection string in .env
   - Shared database for team
   - Automatic backups
   - Monitor usage in dashboard

### For Temporary Testing:
3. **Start mongod Manually** (Option 2)
   - No service installation
   - Keep terminal open
   - Easy to stop/restart

---

## Detailed Steps to Fix (Choice: Local MongoDB)

### Step-by-Step: Install & Start MongoDB

```powershell
# 1. Download from official site (or use chocolatey)
choco install mongodb-community

# 2. Verify installation
Get-Service MongoDB

# 3. Start service if not running
Start-Service MongoDB

# 4. Verify it's listening
netstat -ano | findstr "27017"
# Should show something like: TCP 127.0.0.1 27017 LISTENING

# 5. Test mongosh
mongosh
# Should show: test> (shell prompt)

# 6. Exit mongosh
exit()

# 7. Now start backend in new terminal
cd "C:\Users\hp5cd\blood donar crm\backend"
npm run dev
```

---

## If Connection Still Fails

### Troubleshooting Checklist

1. **Check Firewall**
   ```powershell
   # Windows Defender may block MongoDB
   # Open Windows Defender > Firewall > Allow app through firewall
   # Add mongod.exe to allowed apps
   ```

2. **Check Port Availability**
   ```powershell
   # See if 27017 is being used by something else
   netstat -ano | findstr "27017"
   
   # Kill process using port (if needed)
   taskkill /PID <PID> /F
   ```

3. **Check MongoDB Logs**
   ```powershell
   # Default log location
   Get-Content "C:\Program Files\MongoDB\Server\6.0\log\mongod.log" -Tail 50
   ```

4. **Restart MongoDB Service**
   ```powershell
   Restart-Service MongoDB
   ```

5. **Verify .env Configuration**
   ```powershell
   # Check .env file
   Get-Content "C:\Users\hp5cd\blood donar crm\backend\.env" | grep MONGO
   # Should show correct URI
   ```

---

## Environment Variables Reference

### Current Configuration
```env
MONGO_URI=mongodb://127.0.0.1:27017/blood_donor_crm
MONGODB_URI=mongodb://127.0.0.1:27017/blood_donor_crm
DATABASE_NAME=blood_donor_crm
```

### Alternative: MongoDB Atlas
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/blood_donor_crm
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/blood_donor_crm
```

### Local with Custom Port
```env
MONGO_URI=mongodb://127.0.0.1:27017/blood_donor_crm?authSource=admin
```

---

## Success Indicators

When MongoDB is properly running, you should see:

### Backend Console
```
🚀 Starting Blood Donor CRM AI 2.0...
🔄 Initializing database...
🔄 🔄 Connecting to MongoDB (mongodb://127.0.0.1:27017/blood_donor_crm)...
✅ MongoDB connected successfully (host: 127.0.0.1)
🚀 Server running on port 5001
```

### Browser Test
```
http://localhost:3000/api/status
→ Returns: {"status":"ok","database":"connected"}
```

---

## Next Steps

1. ✅ Choose your MongoDB installation option
2. ✅ Follow the detailed steps for that option
3. ✅ Verify MongoDB is running (check port 27017)
4. ✅ Restart backend: `npm run dev`
5. ✅ Test connection at `http://localhost:3000/api/status`

---

## Support Commands

```powershell
# Check MongoDB service status
Get-Service MongoDB

# Start MongoDB
Start-Service MongoDB

# Stop MongoDB
Stop-Service MongoDB

# Check if port 27017 is listening
netstat -ano | findstr "27017"

# Test connection with mongosh
mongosh

# View recent errors
Get-EventLog System -Source MongoDB* -Newest 10
```

---

**Status**: Ready for action  
**Recommended**: Install MongoDB Community Edition (Option 1)  
**Time to Fix**: 5-15 minutes  
**Difficulty**: Easy ✅
