# 🚀 BLOOD DONAR CRM AI 2.0 - DEPLOYMENT GUIDE

## LOCAL DEVELOPMENT SETUP (Windows/Mac/Linux)

### Prerequisites
- Node.js 16+ ([Download](https://nodejs.org))
- MongoDB 5.0+ ([Download](https://www.mongodb.com/try/download/community))
- OpenAI API Key ([Get here](https://platform.openai.com/api-keys))
- Git
- Text editor (VS Code recommended)

---

## STEP 1: CLONE & INSTALL

```bash
# Navigate to your projects directory
cd ~/projects

# Clone the repository (if applicable)
git clone <repo-url>
cd "blood donar crm"

# Install all dependencies
npm run install-all
```

This runs:
```json
"install-all": "npm install && cd backend && npm install && cd ../frontend && npm install"
```

---

## STEP 2: CONFIGURE ENVIRONMENT VARIABLES

### Backend Configuration (.env)

Create/edit `backend/.env`:

```
# Server Configuration
PORT=5001
NODE_ENV=development

# Database
MONGO_URI=mongodb://localhost:27017/blood-donar-crm
MONGODB_URI=mongodb://localhost:27017/blood-donar-crm

# Authentication
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRY=7d

# OpenAI API (REQUIRED - Get from https://platform.openai.com/api-keys)
OPENAI_API_KEY=sk-proj-... (your actual key)

# CORS Configuration
CORS_ORIGIN=http://localhost:5173,http://localhost:3000

# Email (Optional - for notifications)
EMAIL_SERVICE=gmail
EMAIL_USER=noreply@blooddonarcrm.com
EMAIL_PASSWORD=app_password_here

# Logging
LOG_LEVEL=info
```

### Frontend Configuration (.env)

Create/edit `frontend/.env`:

```
# API Endpoint
VITE_API_URL=http://localhost:5001/api

# App Configuration
VITE_APP_NAME=Blood Donar CRM AI 2.0
VITE_APP_TAGLINE=A Living Intelligence Network That Saves Lives
```

---

## STEP 3: START MONGODB

### Option A: Local MongoDB

```bash
# Start MongoDB service (Windows)
# From elevated command prompt:
net start MongoDB

# Or if installed as executable:
mongod

# On Mac (Homebrew):
brew services start mongodb-community

# On Linux:
sudo systemctl start mongod
```

### Option B: MongoDB Atlas (Cloud)

1. Sign up at [https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster
3. Get connection string
4. Update `.env`:
```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/blood-donar-crm
```

---

## STEP 4: VERIFY DATABASE CONNECTION

```bash
# Open MongoDB shell
mongosh

# Or in older version:
mongo

# Test connection:
use blood-donar-crm
db.donors.find()

# Exit:
exit
```

---

## STEP 5: START DEVELOPMENT SERVERS

### Terminal 1 - Backend

```bash
cd backend
npm run dev
```

Expected output:
```
🔥 Blood Donar CRM AI Backend Server
📊 System Health Monitoring: ENABLED
🤖 AI Engine Status: ACTIVE
🚨 Emergency Control Room: READY
💾 Database: CONNECTED
🌐 Server running on port 5001
```

### Terminal 2 - Frontend

```bash
cd frontend
npm run dev
```

Expected output:
```
VITE v5.4.1 ready in 200 ms

➜ Local:   http://localhost:5173/
➜ Network: http://192.168.x.x:5173/
```

---

## STEP 6: VERIFY INSTALLATION

### Test Backend API

```bash
# Open Terminal 3
curl http://localhost:5001/api/ai/system-health
```

Expected response:
```json
{
  "status": "success",
  "data": {
    "systemHealthScore": 75,
    "totalDonors": 45,
    "availability": 89,
    "emergencyReadiness": 82
  },
  "explanation": "System is operating normally"
}
```

### Test Frontend Access

Open browser: `http://localhost:5173`

You should see:
- Landing page with animated CTA
- Dashboard with real-time metrics
- Navigation working correctly

---

## QUICK TEST SCENARIOS

### Scenario 1: Create an Emergency & Match Donors

```bash
# 1. Create Emergency
curl -X POST http://localhost:5001/api/emergency \
  -H "Content-Type: application/json" \
  -d '{
    "patientName": "John Doe",
    "bloodTypeNeeded": "O+",
    "unitsNeeded": 2,
    "location": "Central Hospital",
    "hospital": "City Medical Center",
    "urgencyLevel": "critical",
    "emergencyType": "Accident"
  }'

# Copy the emergencyId from response

# 2. Activate Swarm Mode
curl -X POST http://localhost:5001/api/ai/swarm \
  -H "Content-Type: application/json" \
  -d '{"emergencyId": "copied_id_here"}'

# 3. Check status
curl http://localhost:5001/api/emergency/copied_id_here
```

### Scenario 2: Check Life Saver Leaderboard

```bash
curl http://localhost:5001/api/ai/leaderboard?limit=5
```

### Scenario 3: Get Blood Demand Forecast

```bash
curl http://localhost:5001/api/ai/forecast
```

---

## TROUBLESHOOTING

### Issue: "Cannot connect to MongoDB"

**Solution:**
```bash
# Check if MongoDB is running
# Windows: sc query MongoDB
# Mac: brew services list
# Linux: sudo systemctl status mongod

# Start MongoDB
mongod

# Verify connection string in .env
```

### Issue: "OpenAI API Key Invalid"

**Solution:**
1. Go to [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. Create new API key
3. Update `backend/.env` with the key
4. Restart backend server

### Issue: "Port 5001 already in use"

**Solution:**
```bash
# Windows - Find process on port 5001
netstat -ano | findstr :5001
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :5001
kill -9 <PID>

# Or change PORT in .env to 5002
```

### Issue: "Frontend can't reach backend"

**Solution:**
1. Ensure backend is running on port 5001
2. Check CORS configuration in `backend/.env`
3. Verify `VITE_API_URL` in `frontend/.env`
4. Clear browser cache (Ctrl+Shift+Delete)
5. Restart both servers

### Issue: "TypeScript errors in VS Code"

**Solution:**
```bash
# Rebuild TypeScript
cd frontend
npm run build

# Or install types
npm install --save-dev @types/node @types/react
```

---

## PRODUCTION DEPLOYMENT

### Deploy Backend to Heroku

```bash
# 1. Install Heroku CLI
# 2. Login
heroku login

# 3. Create app
heroku create blood-donor-crm-api

# 4. Set environment variables
heroku config:set OPENAI_API_KEY=sk-...
heroku config:set JWT_SECRET=your-secret
heroku config:set MONGO_URI=mongodb+srv://...

# 5. Deploy
git push heroku main
```

### Deploy Backend to Railway.app

```bash
# 1. Sign up at railway.app
# 2. Connect GitHub repository
# 3. Add MongoDB plugin
# 4. Set environment variables
# 5. Auto-deploys on push to main
```

### Deploy Frontend to Vercel

```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Login
vercel login

# 3. Deploy
vercel

# 4. Set environment variable
# In Vercel dashboard:
# VITE_API_URL = https://your-api-domain.com/api
```

### Deploy Frontend to Netlify

```bash
# 1. Install Netlify CLI
npm install -g netlify-cli

# 2. Build frontend
cd frontend
npm run build

# 3. Deploy
netlify deploy --prod --dir=dist

# 4. Set environment variable in dashboard
# VITE_API_URL = https://your-api-domain.com/api
```

---

## DATABASE BACKUP & RESTORE

### Backup MongoDB (Local)

```bash
# Create backup
mongodump --db blood-donar-crm --out backup/

# Compress backup
tar -czf backup.tar.gz backup/
```

### Restore MongoDB

```bash
# Restore from backup
mongorestore --db blood-donar-crm backup/blood-donar-crm/
```

### Backup MongoDB Atlas

1. Log into MongoDB Atlas
2. Go to Clusters → Backup
3. Create backup snapshot
4. Set automated daily backups

---

## MONITORING & LOGGING

### View Backend Logs

```bash
# Terminal with backend running
# Logs automatically displayed

# Save logs to file
npm run dev > backend.log 2>&1 &
```

### View MongoDB Logs

```bash
# Mac/Linux
tail -f /var/log/mongodb/mongod.log

# Windows
Get-Content "$env:ProgramFiles\MongoDB\Server\5.0\log\mongod.log" -Tail 50 -Wait
```

### Production Logging Setup

Install and configure Sentry:

```bash
npm install @sentry/node

# Add to backend server.js
const Sentry = require("@sentry/node");
Sentry.init({ dsn: "your-sentry-dsn" });
```

---

## PERFORMANCE OPTIMIZATION

### Frontend Build Optimization

```bash
# Analyze bundle size
npm run build
npm run preview

# Use production build
VITE_APP_MODE=production npm run build
```

### Backend Performance Tuning

1. Enable caching in MongoDB
2. Add database indexes
3. Use connection pooling
4. Implement rate limiting

```bash
# Add to backend/.env
RATE_LIMIT=100/15min
CACHE_ENABLED=true
```

---

## SECURITY CHECKLIST

- [ ] Change JWT_SECRET to strong random value
- [ ] Use HTTPS in production
- [ ] Enable CORS only for trusted domains
- [ ] Implement rate limiting
- [ ] Use bcryptjs for password hashing
- [ ] Add input validation on all endpoints
- [ ] Enable MongoDB authentication
- [ ] Use environment variables for secrets
- [ ] Set up firewall rules
- [ ] Regular security audits
- [ ] Keep dependencies updated

---

## SCALING GUIDELINES

For production with 100+ concurrent users:

1. **Database**: Use MongoDB Atlas with auto-scaling
2. **Backend**: Use load balancing (nginx/HAProxy)
3. **Frontend**: Use CDN (Cloudflare/Fastly)
4. **Caching**: Implement Redis for frequent queries
5. **Monitoring**: Set up uptime monitoring
6. **Alerts**: Configure critical alerts
7. **Documentation**: Keep API docs updated

---

## SUPPORT & RESOURCES

- **MongoDB Docs**: https://docs.mongodb.com
- **Express Docs**: https://expressjs.com
- **React Docs**: https://react.dev
- **OpenAI Docs**: https://platform.openai.com/docs
- **Heroku Docs**: https://devcenter.heroku.com
- **Vercel Docs**: https://vercel.com/docs

---

## NEXT STEPS

1. ✅ Follow Quick Start above
2. ✅ Test all endpoints
3. ✅ Verify database connectivity
4. ✅ Test emergency matching flow
5. ✅ Deploy to staging environment
6. ✅ Run security audit
7. ✅ Deploy to production
8. ✅ Monitor system performance

---

**Questions?** Check README.md for comprehensive documentation.

**Ready to save lives?** 🔥

Let's launch! 🚀
