# MongoDB Connection - Complete Troubleshooting Guide

## 🔍 What's the Problem?

Your backend is trying to connect to MongoDB at `mongodb://127.0.0.1:27017/blood_donor_crm`, but MongoDB is:
- ❌ Not installed on your system
- ❌ Not running
- ❌ Not listening on port 27017

## ✅ Solutions (Pick One)

### 🚀 **Option A: MongoDB Atlas (FASTEST - Recommended)**
**Time**: 5 minutes | **Installation**: None required | **Cost**: Free

Perfect for quick setup without local installation.

👉 **See**: [MONGODB_ATLAS_SETUP.md](MONGODB_ATLAS_SETUP.md)

**Quick steps:**
1. Create free account at https://www.mongodb.com/cloud/atlas
2. Create free M0 cluster
3. Get connection string
4. Update `.env` file with connection string
5. Done! ✅

---

### 💻 **Option B: Install MongoDB Community (LOCAL)**
**Time**: 10 minutes | **Installation**: Required | **Cost**: Free

Full control, running locally on your machine.

👉 **See**: [MONGODB_DIAGNOSTIC.md](MONGODB_DIAGNOSTIC.md) → "Option 1: Install MongoDB Community Edition"

**Quick steps:**
1. Download from https://www.mongodb.com/try/download/community
2. Run MSI installer
3. Leave "Run MongoDB as Service" checked
4. Restart backend
5. Done! ✅

---

### 📝 **Option C: Manual MongoDB Start (TEMPORARY)**
**Time**: 2 minutes | **Installation**: MongoDB already installed | **Cost**: Free

Manually start MongoDB when needed.

👉 **See**: [MONGODB_DIAGNOSTIC.md](MONGODB_DIAGNOSTIC.md) → "Option 2: Start MongoDB Manually"

**Quick steps:**
1. Open PowerShell
2. Run: `mongod --dbpath "C:\data\db"`
3. Keep this terminal open
4. In new terminal: `cd backend && npm run dev`
5. Done! ✅

---

## 🧪 Test Your Connection

Before starting the backend, test if MongoDB is configured correctly:

```powershell
cd backend
node test-mongodb.js
```

This will tell you if your connection is working!

**Output:**
- ✅ "CONNECTION SUCCESSFUL!" → Ready to start backend
- ❌ Error message → See troubleshooting suggestions

---

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| **MONGODB_DIAGNOSTIC.md** | Complete diagnostic and troubleshooting guide |
| **MONGODB_ATLAS_SETUP.md** | Quick cloud setup (recommended) |
| **test-mongodb.js** | Connection testing script |
| **mongodb-setup.ps1** | PowerShell verification script |
| **mongodb-check.bat** | Batch verification script |

---

## 🎯 Recommended Path (Step-by-Step)

### For Quickest Setup (Recommended):

1. ✅ **Read**: [MONGODB_ATLAS_SETUP.md](MONGODB_ATLAS_SETUP.md)
2. ✅ **Create**: Free MongoDB Atlas account
3. ✅ **Get**: Connection string from Atlas
4. ✅ **Update**: `.env` file with connection string
5. ✅ **Test**: Run `node test-mongodb.js`
6. ✅ **Start**: Run `npm run dev`

**Total time: 5 minutes**

---

### If You Prefer Local Installation:

1. ✅ **Read**: [MONGODB_DIAGNOSTIC.md](MONGODB_DIAGNOSTIC.md)
2. ✅ **Download**: MongoDB from https://www.mongodb.com/try/download/community
3. ✅ **Install**: Run MSI installer
4. ✅ **Verify**: MongoDB service is running
5. ✅ **Test**: Run `node test-mongodb.js`
6. ✅ **Start**: Run `npm run dev`

**Total time: 10-15 minutes**

---

## 🚨 Quick Fixes

### If MongoDB Atlas is too much setup:
→ Use [MONGODB_DIAGNOSTIC.md](MONGODB_DIAGNOSTIC.md) → Option 1: Install MongoDB

### If you don't want to install anything:
→ Use [MONGODB_ATLAS_SETUP.md](MONGODB_ATLAS_SETUP.md)

### If you need detailed troubleshooting:
→ Use [MONGODB_DIAGNOSTIC.md](MONGODB_DIAGNOSTIC.md)

---

## 🧬 Current Status

```
MongoDB Installation:  ❌ NOT INSTALLED
MongoDB Service:       ❌ NOT RUNNING
Port 27017:            ❌ NOT LISTENING
mongod Executable:     ❌ NOT FOUND
.env Configuration:    ✅ CORRECT
```

**Action needed**: Install MongoDB OR use MongoDB Atlas

---

## ⚡ Quick Command Reference

### Test Connection
```powershell
cd backend
node test-mongodb.js
```

### Run Diagnostic
```powershell
./mongodb-setup.ps1
```

### Start Backend (after MongoDB is running)
```powershell
cd backend
npm run dev
```

### Check Port 27017
```powershell
netstat -ano | findstr "27017"
```

### Start MongoDB Manually
```powershell
mongod --dbpath "C:\data\db"
```

---

## 📞 Getting Help

1. **For MongoDB Atlas setup**: Read [MONGODB_ATLAS_SETUP.md](MONGODB_ATLAS_SETUP.md)
2. **For local MongoDB setup**: Read [MONGODB_DIAGNOSTIC.md](MONGODB_DIAGNOSTIC.md)
3. **For testing connection**: Run `node test-mongodb.js`
4. **For verification**: Run `./mongodb-setup.ps1`

---

## ✅ Success Criteria

When MongoDB is properly configured, you should see:

```
🚀 Starting Blood Donor CRM AI 2.0...
🔄 Initializing database...
✅ MongoDB connected successfully (host: 127.0.0.1)
🚀 Server running on port 5001
```

---

## 🎓 Choose Your Path

**→ I want the fastest setup** 
→ [MONGODB_ATLAS_SETUP.md](MONGODB_ATLAS_SETUP.md) (5 min)

**→ I prefer local MongoDB**
→ [MONGODB_DIAGNOSTIC.md](MONGODB_DIAGNOSTIC.md) (15 min)

**→ I'm having issues**
→ [MONGODB_DIAGNOSTIC.md](MONGODB_DIAGNOSTIC.md) + Troubleshooting

**→ I want to test first**
→ Run `node test-mongodb.js`

---

## 🚀 Next Step

**Choose one:**

1. **MongoDB Atlas** (recommended) → Open [MONGODB_ATLAS_SETUP.md](MONGODB_ATLAS_SETUP.md)
2. **Local MongoDB** → Open [MONGODB_DIAGNOSTIC.md](MONGODB_DIAGNOSTIC.md)
3. **Test Connection** → Run `node test-mongodb.js` in backend folder

---

**Version**: 1.0  
**Status**: Ready to Fix  
**Difficulty**: Easy ✅  
**Time**: 5-15 minutes depending on choice  

🎯 **Choose an option above and follow the guide!**
