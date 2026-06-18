# MongoDB Atlas .env Configuration Examples

This file shows example .env configurations for different scenarios.

## Development Configuration (Local Testing)

```env
# Server Configuration
PORT=5001
NODE_ENV=development

# MongoDB Atlas - Development
# Replace placeholders with your actual values from MongoDB Atlas Dashboard
MONGO_URI=mongodb+srv://bloodconnect_admin:YOUR_PASSWORD@cluster0.a1b2c3d4.mongodb.net/blood_donor_crm?retryWrites=true&w=majority
MONGODB_URI=mongodb+srv://bloodconnect_admin:YOUR_PASSWORD@cluster0.a1b2c3d4.mongodb.net/blood_donor_crm?retryWrites=true&w=majority
DATABASE_NAME=blood_donor_crm

# Database Retry Configuration
DB_MAX_RETRIES=5
DB_INITIAL_DELAY_MS=2000

# JWT
JWT_SECRET=super_secure_jwt_secret_123
JWT_EXPIRY=7d

# OpenAI API
OPENAI_API_KEY=sk-your-openai-api-key-here

# CORS
CORS_ORIGIN=http://localhost:5173,http://localhost:3000

# Analytics
ANALYTICS_ENABLED=true

# Logging
LOG_LEVEL=info
```

---

## Production Configuration

```env
# Server Configuration
PORT=5001
NODE_ENV=production

# MongoDB Atlas - Production
# Use separate production user and strong password
MONGO_URI=mongodb+srv://prod_admin:secure_random_password_here@cluster0-prod.a1b2c3d4.mongodb.net/blood_donor_crm?retryWrites=true&w=majority
MONGODB_URI=mongodb+srv://prod_admin:secure_random_password_here@cluster0-prod.a1b2c3d4.mongodb.net/blood_donor_crm?retryWrites=true&w=majority
DATABASE_NAME=blood_donor_crm

# Database Retry Configuration
DB_MAX_RETRIES=5
DB_INITIAL_DELAY_MS=2000

# JWT - Use strong random string for production
JWT_SECRET=generate_random_secure_string_with_crypto_openssl
JWT_EXPIRY=7d

# OpenAI API
OPENAI_API_KEY=sk-production-api-key-here

# CORS - Restrict to production domain only
CORS_ORIGIN=https://yourdomain.com,https://app.yourdomain.com

# Analytics
ANALYTICS_ENABLED=true

# Logging
LOG_LEVEL=warn

# Email Configuration (optional)
EMAIL_SERVICE=gmail
EMAIL_USER=noreply@yourdomain.com
EMAIL_PASSWORD=app-specific-password
```

---

## Configuration with Special Characters in Password

### Example Scenario
- Username: `admin`
- Password: `P@ss#123!`

### URL-Encoding Reference
```
@ → %40
# → %23
% → %25
: → %3A
/ → %2F
! → %21
$ → %24
& → %26
' → %27
( → %28
) → %29
* → %2A
+ → %2B
, → %2C
; → %3B
= → %3D
? → %3F
[ → %5B
] → %5D
```

### Correct .env Configuration

```env
# Password: P@ss#123!
# URL-encoded: P%40ss%23123%21

MONGO_URI=mongodb+srv://admin:P%40ss%23123%21@cluster0.a1b2c3d4.mongodb.net/blood_donor_crm?retryWrites=true&w=majority
MONGODB_URI=mongodb+srv://admin:P%40ss%23123%21@cluster0.a1b2c3d4.mongodb.net/blood_donor_crm?retryWrites=true&w=majority
```

---

## Connection String Breakdown

```
mongodb+srv://bloodconnect_admin:MyPassword@cluster0.a1b2c3d4.mongodb.net/blood_donor_crm?retryWrites=true&w=majority
│             │                  │           │                         │                  │              │
│             │                  │           │                         │                  │              └─ Connection Options
│             │                  │           │                         │                  └─ Database Name
│             │                  │           │                         └─ Cluster Domain
│             │                  │           └─ Atlas Marker (+srv)
│             │                  └─ Database Password
│             └─ Database Username
└─ Protocol (MongoDB Atlas SRV)

Protocol Options:
  mongodb://    = Local MongoDB or standard connection
  mongodb+srv:// = MongoDB Atlas cloud connection (recommended)
```

---

## Getting Your Values from MongoDB Atlas

### 1. Username & Password
**Where to find:**
1. Go to https://cloud.mongodb.com
2. Click "Database Access" in left sidebar
3. Find user "bloodconnect_admin"
4. Use these credentials in connection string

### 2. Cluster Name
**Where to find:**
1. Go to https://cloud.mongodb.com
2. Click "Deployments" in left sidebar
3. Find cluster "Cluster0"
4. Click "Connect" → "Drivers"
5. Copy connection string
6. Extract cluster name from: `cluster0.xxxxx.mongodb.net`

### 3. Full Connection String
**Where to find:**
1. Go to https://cloud.mongodb.com
2. Find your cluster
3. Click "Connect" button
4. Select "Drivers" → "Node.js"
5. Copy full connection string in code block

---

## Environment Variable Loading

The backend automatically loads `.env` using `dotenv`:

```javascript
// In server.js
dotenv.config();

// Now access with:
const mongoUri = process.env.MONGO_URI;
const port = process.env.PORT;
const secret = process.env.JWT_SECRET;
```

### Load Order
1. Check `process.env.MONGO_URI`
2. Check `process.env.MONGODB_URI`
3. Fall back to `mongodb://127.0.0.1:27017/blood_donor_crm`

---

## Deployment Scenarios

### Docker Deployment

```dockerfile
# In Dockerfile
ENV NODE_ENV=production
ENV PORT=5001
ENV MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/db
ENV JWT_SECRET=your-secret-here
ENV OPENAI_API_KEY=sk-your-key-here
```

### Heroku Deployment

```bash
# Set config variables
heroku config:set NODE_ENV=production
heroku config:set MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/db
heroku config:set JWT_SECRET=your-secret-here
heroku config:set OPENAI_API_KEY=sk-your-key-here

# Verify
heroku config
```

### AWS Lambda / Serverless

```yaml
# serverless.yml
provider:
  environment:
    NODE_ENV: production
    MONGO_URI: ${env:MONGO_URI}
    JWT_SECRET: ${env:JWT_SECRET}
    OPENAI_API_KEY: ${env:OPENAI_API_KEY}
```

### Railway / Render / Other Platforms

Use platform's environment variable UI:
1. Add each variable individually
2. Or paste `.env` contents in bulk import
3. Redact sensitive values before sharing

---

## Security Best Practices

✅ **DO:**
- Use strong random passwords (16+ characters)
- Include uppercase, lowercase, numbers, symbols
- Rotate passwords every 90 days in production
- Use separate credentials for dev/staging/production
- Store .env in `.gitignore` (never commit to Git)
- Use platform secrets manager for production
- Restrict IP whitelist to known servers
- Enable MongoDB Atlas VPC network peering

❌ **DON'T:**
- Commit .env to version control
- Share connection strings in Slack/Email
- Use simple passwords like "password123"
- Use same credentials across environments
- Whitelist 0.0.0.0/0 in production
- Log full connection strings with passwords
- Store secrets in frontend code

---

## Environment Variables in Different Contexts

### Development Machine
```bash
# Create .env in backend directory
backend/.env
```

### GitHub Secrets (CI/CD)
```yaml
# In .github/workflows/deploy.yml
env:
  MONGO_URI: ${{ secrets.MONGO_URI }}
  JWT_SECRET: ${{ secrets.JWT_SECRET }}
```

### GitHub Codespaces
```bash
# Set in Codespaces settings
MONGO_URI=mongodb+srv://...
JWT_SECRET=...
```

### VS Code Environment
```json
// In .vscode/settings.json
{
  "terminal.integrated.env.osx": {
    "MONGO_URI": "mongodb+srv://..."
  }
}
```

---

## Testing Configuration

```env
# For npm test
NODE_ENV=test

# Use test database (separate from production)
MONGO_URI=mongodb+srv://test_user:test_pass@cluster0.a1b2c3d4.mongodb.net/blood_donor_crm_test?retryWrites=true&w=majority
DATABASE_NAME=blood_donor_crm_test

# Use test JWT secret
JWT_SECRET=test-secret-for-unit-tests
JWT_EXPIRY=1h

# Use mock OpenAI key (if testing without API calls)
OPENAI_API_KEY=sk-test-key-not-real
```

---

## Verifying Configuration

### Check if .env is loaded correctly

```bash
cd backend

# Node.js script to verify
node -e "require('dotenv').config(); console.log(process.env.MONGO_URI)"

# Should output your MongoDB Atlas connection string
```

### Check if connection works

```bash
node test-mongodb.js
```

### Check if server starts

```bash
npm run dev
```

### Check if API responds

```bash
curl http://localhost:5001/api/status
```

---

## Troubleshooting Configuration

### Problem: "MONGO_URI is not set"

**Cause**: .env file not found or not loaded

**Fix**:
```bash
# Check .env exists
ls -la backend/.env

# Check content
cat backend/.env

# Verify dotenv is installed
npm list dotenv
```

### Problem: "authentication failed"

**Cause**: Password contains special chars not URL-encoded

**Fix**:
1. Check password for special characters: `@#%:/!$&'()*+,;=?[]`
2. URL-encode each special character
3. Update MONGO_URI with encoded version
4. Test with: `node test-mongodb.js`

### Problem: "Invalid hostname"

**Cause**: Cluster name typo in connection string

**Fix**:
1. Go to MongoDB Atlas Dashboard
2. Click "Connect" → "Drivers"
3. Copy connection string exactly
4. Paste into .env
5. Replace only: username, password, database name

### Problem: "Illegal character in hostname"

**Cause**: Password not URL-encoded, special chars breaking connection string

**Fix**:
1. Check for: `@` `:` `#` `/` `%` `!` `$`
2. URL-encode each one
3. Example: `Pass@123` → `Pass%40123`

---

## Environment Variable Naming Conventions

| Variable | Type | Example |
|----------|------|---------|
| `MONGO_URI` | Connection String | `mongodb+srv://user:pass@cluster.mongodb.net/db` |
| `MONGODB_URI` | Connection String (alt) | `mongodb+srv://user:pass@cluster.mongodb.net/db` |
| `DATABASE_NAME` | String | `blood_donor_crm` |
| `DB_MAX_RETRIES` | Integer | `5` |
| `DB_INITIAL_DELAY_MS` | Integer | `2000` |
| `PORT` | Integer | `5001` |
| `NODE_ENV` | String | `development`, `production` |
| `JWT_SECRET` | String | Long random string |
| `JWT_EXPIRY` | String | `7d`, `1h`, `30d` |
| `OPENAI_API_KEY` | String | `sk-...` |
| `CORS_ORIGIN` | String | URL list comma-separated |
| `LOG_LEVEL` | String | `debug`, `info`, `warn`, `error` |

---

## Template .env for Quick Setup

Copy and paste this template, then fill in YOUR values:

```env
PORT=5001
NODE_ENV=development

# Fill in YOUR values below
MONGO_URI=mongodb+srv://bloodconnect_admin:YOUR_PASSWORD@YOUR_CLUSTER_NAME.mongodb.net/blood_donor_crm?retryWrites=true&w=majority
MONGODB_URI=mongodb+srv://bloodconnect_admin:YOUR_PASSWORD@YOUR_CLUSTER_NAME.mongodb.net/blood_donor_crm?retryWrites=true&w=majority
DATABASE_NAME=blood_donor_crm

DB_MAX_RETRIES=5
DB_INITIAL_DELAY_MS=2000

JWT_SECRET=super_secure_jwt_secret_123
JWT_EXPIRY=7d

OPENAI_API_KEY=sk-your-openai-api-key-here

CORS_ORIGIN=http://localhost:5173,http://localhost:3000

ANALYTICS_ENABLED=true
LOG_LEVEL=info
```

Then replace:
1. `YOUR_PASSWORD` - Your database password
2. `YOUR_CLUSTER_NAME` - Your cluster name (e.g., cluster0.a1b2c3d4)

---

## Next Steps

1. Create MongoDB Atlas account: https://www.mongodb.com/cloud/atlas
2. Create cluster and database user
3. Copy connection string
4. Update .env with your values
5. Run: `node test-mongodb.js`
6. Run: `npm run dev`
7. Verify at: `curl http://localhost:5001/api/status`

---

**For Complete Setup Guide**: See MONGODB_ATLAS_IMPLEMENTATION.md  
**For Troubleshooting**: See MONGODB_ATLAS_COMPLETE.md  
**For Quick Reference**: Keep this file handy!
