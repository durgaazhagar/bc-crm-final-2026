# ⚡ QUICK START - 5 MINUTES TO RUNNING

## 🎯 Your Blood Donar CRM AI 2.0 is ready!

This guide gets you running in 5 minutes.

---

## STEP 1: Install Dependencies (1 minute)

```bash
cd "c:\Users\hp5cd\blood donar crm"
npm run install-all
```

Expected output: "up to date" for all 3 folders

---

## STEP 2: Start MongoDB (1 minute)

**Windows (via Service):**
```bash
net start MongoDB
```

**Or via Command Line:**
```bash
mongod
```

**MacOS (Homebrew):**
```bash
brew services start mongodb-community
```

**Verify it's running:**
```bash
mongosh
# Type: exit
```

---

## STEP 3: Configure Environment (1 minute)

### Backend .env
Open `backend\.env` and ensure:
```
PORT=5001
MONGO_URI=mongodb://localhost:27017/blood-donar-crm
OPENAI_API_KEY=sk-... (get from https://platform.openai.com/api-keys)
JWT_SECRET=your_secret_key
```

### Frontend .env  
Open `frontend\.env` and ensure:
```
VITE_API_URL=http://localhost:5001/api
```

---

## STEP 4: Start Backend (1 minute)

**Terminal 1:**
```bash
cd backend
npm run dev
```

✅ You should see:
```
🔥 Blood Donar CRM AI Backend Server
📊 System Health Monitoring: ENABLED
🤖 AI Engine Status: ACTIVE
🚨 Emergency Control Room: READY
💾 Database: CONNECTED
🌐 Server running on port 5001
```

---

## STEP 5: Start Frontend (1 minute)

**Terminal 2:**
```bash
cd frontend
npm run dev
```

✅ You should see:
```
VITE v5.4.1 ready in 200 ms
➜ Local: http://localhost:5173/
```

---

## 🎉 DONE! Your System is LIVE

### Access Points
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5001/api
- **API Documentation**: See API_DOCUMENTATION.md

---

## 🧪 Test It Working

### Test 1: System Health (in new terminal)
```bash
curl http://localhost:5001/api/ai/system-health
```

Should return JSON with system metrics ✅

### Test 2: Create Emergency
```bash
curl -X POST http://localhost:5001/api/emergency \
  -H "Content-Type: application/json" \
  -d '{"patientName":"Test","bloodTypeNeeded":"O+","unitsNeeded":2,"location":"Hospital","urgencyLevel":"critical"}'
```

Should return emergency ID ✅

### Test 3: Frontend Working
Open http://localhost:5173 in browser  
You should see landing page with animated UI ✅

---

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| [README.md](README.md) | Feature overview & architecture |
| [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) | Production deployment steps |
| [API_DOCUMENTATION.md](API_DOCUMENTATION.md) | All 40+ endpoints with examples |
| [BUILD_SUMMARY.md](BUILD_SUMMARY.md) | What was built and how |
| [PROJECT_VERIFICATION_CHECKLIST.md](PROJECT_VERIFICATION_CHECKLIST.md) | Verification status |

---

## 🆘 Troubleshooting

### "Port 5001 already in use"
```bash
# Find what's using it
netstat -ano | findstr :5001
# Kill it
taskkill /PID <PID> /F
```

### "Cannot connect to MongoDB"
```bash
# Start MongoDB
mongod
# Or verify it's running: sc query MongoDB
```

### "API Key error"
1. Go to https://platform.openai.com/api-keys
2. Create new API key
3. Add to backend/.env as OPENAI_API_KEY
4. Restart backend

### "CORS error in frontend"
Verify backend is running on port 5001
Verify VITE_API_URL=http://localhost:5001/api in frontend/.env

---

## 🚀 Key Features to Try

### 1. Emergency Control Room
- Go to http://localhost:5173/app/emergency
- Create emergency
- Watch real-time donor matching
- Activate swarm mode

### 2. Dashboard
- http://localhost:5173/app
- View system health metrics
- Real-time donor availability
- Emergency statistics

### 3. AI Insights
- http://localhost:5173/app/insights
- Life Saver Heroes leaderboard
- 7-day blood demand forecast
- Regional risk assessment

---

## 🎯 Next Steps

1. ✅ **Running?** Great! Explore the UI
2. 📊 **Test Features** - Try creating emergencies
3. 📖 **Read Docs** - See README.md for details
4. 🚀 **Deploy** - Follow DEPLOYMENT_GUIDE.md for production

---

## 💡 Pro Tips

### Reset Database
```bash
mongosh
use blood-donar-crm
db.dropDatabase()
exit
```

### View Logs
Backend logs show in Terminal 1 automatically

### Kill Servers
Press `Ctrl+C` in each terminal

### Test All Endpoints
See API_DOCUMENTATION.md for 40+ endpoint examples

---

## ✨ You Now Have

✅ Real-time emergency donor matching  
✅ AI-powered system intelligence  
✅ Life Saver scoring leaderboard  
✅ Blood demand forecasting  
✅ Hospital-grade reliability  
✅ Dark futuristic UI with animations  
✅ Complete API documentation  
✅ Production-ready codebase  

---

## 🔥 **Let's Save Lives!**

Your Blood Donar CRM AI 2.0 system is running.

**Questions?** Check the documentation files.  
**Issues?** See Troubleshooting section above.  
**Ready to deploy?** Follow DEPLOYMENT_GUIDE.md

---

**Status**: 🟢 **LIVE & RUNNING**

Start creating emergencies and watching the AI match donors in real-time! 🚨💉✨
