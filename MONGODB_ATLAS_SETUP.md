# MongoDB Atlas Quick Start (5 Minutes)

**No installation required. Cloud-based, free for development.**

## Step 1: Create Free Account (1 min)

1. Go to: https://www.mongodb.com/cloud/atlas
2. Click "Start Free"
3. Sign up with:
   - Email address, OR
   - Google account, OR  
   - GitHub account

## Step 2: Create Free Cluster (3 mins)

1. After sign-up, you'll see the **Projects** page
2. Click **"New Project"** (or use default)
3. Click **"Create"**
4. Click **"Build a Database"**
5. Choose deployment:
   - **Provider**: AWS (default)
   - **Region**: Pick closest to you
   - **Tier**: M0 (FREE) ✓
6. Click **"Create Deployment"**
7. Wait 5-10 minutes for cluster to initialize

## Step 3: Create Database User (1 min)

1. You'll see a prompt: "How would you like to authenticate?"
2. Enter:
   - **Username**: `bloodconnect_user`
   - **Password**: Create a strong password (save it!)
3. Click **"Create User"**

## Step 4: Whitelist IP Address (1 min)

1. Next prompt: "Where would you like to connect from?"
2. For development, choose: **Allow access from anywhere** (0.0.0.0/0)
3. Click **"Finish and Close"**

## Step 5: Get Connection String (1 min)

1. In the **Clusters** section, find your cluster
2. Click **"Connect"** button
3. Choose **"Connect your application"**
4. Select **Driver**: Node.js
5. Copy the connection string:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

## Step 6: Update .env File

Replace the MONGO_URI in `backend/.env`:

```env
# Before (local - NOT WORKING):
MONGO_URI=mongodb://127.0.0.1:27017/blood_donor_crm

# After (Atlas - WORKING):
MONGO_URI=mongodb+srv://bloodconnect_user:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/blood_donor_crm?retryWrites=true&w=majority
```

**Important**: 
- Replace `bloodconnect_user` with your username
- Replace `YOUR_PASSWORD` with your password
- Replace `cluster0.xxxxx` with your cluster name (copy from Atlas)
- Replace database name if different

### Password with Special Characters?

If your password has special characters like `@`, `#`, `%`, URL-encode them:
- `@` → `%40`
- `#` → `%23`
- `%` → `%25`
- `:` → `%3A`

Example: password `Pass@word#123` becomes `Pass%40word%23123`

## Step 7: Test Connection

```powershell
cd backend
npm run dev
```

You should see:
```
✅ MongoDB connected successfully (host: cluster0.xxxxx.mongodb.net)
🚀 Server running on port 5001
```

---

## Success! 

Your backend is now connected to MongoDB Atlas. The chatbot and all features will work!

---

## Useful MongoDB Atlas Links

- **Dashboard**: https://cloud.mongodb.com
- **Documentation**: https://docs.atlas.mongodb.com
- **Pricing**: Always free tier available for development
- **Monitoring**: View database usage in real-time

---

## Troubleshooting

### Connection Fails
- Check username and password are correct
- Verify IP whitelist includes your IP
- Check connection string has correct cluster name

### Database Empty
- First connection creates the database automatically
- Collections are created when first document is inserted

### Need to Change Password
- MongoDB Atlas Dashboard → Database Access → Edit User
- Update .env with new password
- Restart backend

---

## Switching Back to Local MongoDB

To use local MongoDB instead:

```env
MONGO_URI=mongodb://127.0.0.1:27017/blood_donor_crm
```

Then install and start MongoDB locally as described in MONGODB_DIAGNOSTIC.md

---

**Time to complete**: 5 minutes  
**Cost**: Free  
**Data limit**: 512MB (plenty for development)  
**Status**: ✅ Ready to use
