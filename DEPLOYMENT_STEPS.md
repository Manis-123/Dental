# Step-by-Step Deployment Guide

## 🎯 Prerequisites

Before you start, ensure you have:

- [x] GitHub account
- [x] MongoDB Atlas account (free tier ok)
- [x] Render.com or Railway.app account
- [x] Vercel.com account
- [x] Both frontend and backend code ready
- [x] `.env` files created (never commit these!)

---

## 📝 Step 1: Prepare Your Code

### 1.1 Backend Setup

**Create `backend/.env` with production values:**

```bash
cd backend
cp .env.example .env
# Edit .env with real values
```

**Fill in your values:**
```env
MONGODB_URI=mongodb+srv://your_user:your_password@cluster.mongodb.net/dental_clinic
JWT_SECRET=your-32-character-secret-key-here
CLIENT_URL=https://yourdomain.vercel.app
NODE_ENV=production
PORT=3000
```

**Generate strong JWT secret:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 1.2 Frontend Setup

**Create `frontend/.env`:**

```bash
cd frontend
cp .env.example .env
```

**Fill in your values (you'll get these after backend is deployed):**
```env
VITE_API_URL=https://your-backend.onrender.com/api
```

### 1.3 Update .gitignore

**Ensure `.env` files are not tracked:**

```bash
# In root of project, edit .gitignore
.env
.env.local
.env.*.local
```

---

## 🚀 Step 2: Deploy Backend on Render

### 2.1 Push Code to GitHub

```bash
# From root folder
git add .
git commit -m "Production deployment setup"
git push origin main
```

### 2.2 Create Render Service

1. **Visit** https://render.com
2. **Sign in** with GitHub
3. **Click** "New +" → "Web Service"
4. **Select** your GitHub repository
5. **Configure:**
   - Name: `dental-clinic-api`
   - Environment: `Node`
   - Region: Choose closest to you
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Plan: Free (or Paid for better uptime)

### 2.3 Add Environment Variables

In Render Dashboard:

1. **Go to** Settings → Environment
2. **Add each variable from `.env`:**

```
MONGODB_URI = mongodb+srv://user:pass@cluster.mongodb.net/dental_clinic
JWT_SECRET = your-generated-secret-key
CLIENT_URL = https://yourdomain.vercel.app
NODE_ENV = production
PORT = 3000
```

### 2.4 Deploy

1. **Click** "Create Web Service"
2. **Wait** for build to complete (5-10 minutes)
3. **Get URL**: Shows as `https://dental-clinic-api.onrender.com`
4. **Test health**: 
   ```
   https://dental-clinic-api.onrender.com/api/health
   ```
   Should return: `{"status":"ok"...}`

**Keep this URL for frontend setup!**

---

## 🎨 Step 3: Deploy Frontend on Vercel

### 3.1 Update Frontend .env

**In `frontend/.env`:**

```env
VITE_API_URL=https://dental-clinic-api.onrender.com/api
```

### 3.2 Commit Changes

```bash
git add frontend/.env
git commit -m "Add production API URL"
git push origin main
```

### 3.3 Deploy on Vercel

1. **Visit** https://vercel.com
2. **Click** "Add New Project"
3. **Select** your GitHub repo
4. **Framework Preset**: Vite
5. **Build Settings:**
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

### 3.4 Add Environment Variables in Vercel

1. **In Vercel dashboard**: Settings → Environment Variables
2. **Add variable:**
   - Name: `VITE_API_URL`
   - Value: `https://dental-clinic-api.onrender.com/api`
   - Environments: Production, Preview, Development
3. **Click** Save

### 3.5 Deploy

1. **Redeploy** after adding env vars
2. **Wait** for deployment (2-3 minutes)
3. **Get URL**: Shows as `https://yourdomain.vercel.app`
4. **Test**: Visit the site, should see login page

---

## ✅ Step 4: Test Production Setup

### 4.1 Test Backend

```bash
# Check health
curl https://dental-clinic-api.onrender.com/api/health

# Should return something like:
# {"status":"ok","message":"Dental Clinic API is running","environment":"production"}
```

### 4.2 Test Frontend

1. **Visit** your Vercel URL
2. **Try to login** with admin credentials:
   - Email: `admin@dental.com`
   - Password: `admin123`

**If you haven't created admin yet, run on your local backend:**
```bash
cd backend
node createAdmin.js
```

### 4.3 Test API Connection

1. **Open browser DevTools** (F12)
2. **Go to** Network tab
3. **Try to login** in the app
4. **Check** that network request goes to `https://dental-clinic-api.onrender.com/api/auth/login`

**If showing localhost, env variable wasn't set correctly.**

### 4.4 Check for CORS Errors

If you see error:
```
Access to XMLHttpRequest at 'https://...' has been blocked by CORS policy
```

**Fix:**
1. Go to Render dashboard
2. Find your service
3. Edit Environment → CLIENT_URL
4. Make sure it includes your Vercel domain:
   ```
   https://yourdomain.vercel.app,https://yourdomain.com
   ```
5. Redeploy

---

## 🔧 Step 5: Post-Deployment Configuration

### 5.1 Custom Domain (Optional)

**For Frontend (Vercel):**
1. Settings → Domains
2. Add your custom domain
3. Follow DNS instructions

**For Backend (Render):**
1. Settings → Custom Domain
2. Add your domain
3. Update CORS CLIENT_URL with new domain

### 5.2 Enable Auto-Deploy

Both platforms auto-deploy on GitHub push. Ensure:

1. **GitHub** has latest code
2. **Environment variables** are set in platforms
3. **`.env` files are NOT committed**

### 5.3 Monitor Logs

**Render:**
- Dashboard → Your Service → Logs

**Vercel:**
- Dashboard → Deployments → Click deployment → Function Logs

---

## 🐛 Troubleshooting

### Problem 1: 401 Unauthorized Error

```
Error: Unauthorized - Please login again
```

**Cause:** JWT_SECRET mismatch or token expired

**Fix:**
1. Check JWT_SECRET in Render is same as in code
2. Generate new secret: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
3. Update in Render environment
4. Redeploy backend

### Problem 2: CORS Error

```
Access to XMLHttpRequest at '...' has been blocked by CORS policy
```

**Cause:** Frontend domain not in CLIENT_URL

**Fix:**
1. Add frontend URL to Render CLIENT_URL
2. Include https://
3. Multiple domains: `https://domain1.com,https://domain2.com`
4. Redeploy

### Problem 3: Cannot connect to database

```
MongoServerError: getaddrinfo ENOTFOUND
```

**Cause:** MONGODB_URI is wrong or IP not whitelisted

**Fix:**
1. Check MongoDB URI is correct
2. In MongoDB Atlas: Network Access → Add IP address `0.0.0.0/0`
3. Test connection string locally first
4. Restart service in Render

### Problem 4: 500 Internal Server Error

**Check backend logs in Render:**
1. Dashboard → Service → Logs
2. Look for error messages
3. Common causes:
   - Missing environment variable
   - Database connection failed
   - Route error

**Fix:**
1. Review error in logs
2. Update environment variable if needed
3. Redeploy

### Problem 5: Website loads but API calls fail

**Check Network tab in browser DevTools (F12):**
1. Go to Network tab
2. Perform action (like login)
3. Check if API request shows correct URL
4. Look for response status and error

**Solutions:**
1. If URL is wrong: Check VITE_API_URL in Vercel environment
2. If CORS error: Update CLIENT_URL in Render
3. If timeout: Backend might be sleeping (free tier Render pauses), upgrade plan

---

## 📊 Monitoring & Maintenance

### Daily Checks

```bash
# Test API health
curl https://your-backend.onrender.com/api/health

# Test login (from browser console)
fetch('https://your-backend.onrender.com/api/auth/login', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({email: 'admin@dental.com', password: 'admin123'})
}).then(r => r.json()).then(console.log)
```

### Set Up Alerts

1. **Render**: Settings → Notifications → Enable email alerts
2. **Vercel**: Settings → Integrations → Add monitoring
3. **GitHub**: Enable branch protection rules

### Backup Database

1. **MongoDB Atlas**: Backup → Enable automatic backups
2. **Render**: No direct backup, MongoDB handles it

---

## 🔒 Security Checklist

- [ ] JWT_SECRET is 32+ characters
- [ ] Never commit .env files
- [ ] HTTPS is enabled (auto on Render & Vercel)
- [ ] CORS only allows your domain
- [ ] Database password is strong
- [ ] API keys are in environment, not in code
- [ ] Error messages don't expose sensitive info
- [ ] Logs don't contain passwords or tokens

---

## 📦 Update Deployment Process

For future updates:

```bash
# 1. Make changes in code
# 2. Test locally
# 3. Commit and push
git add .
git commit -m "Update feature"
git push origin main

# 4. Platforms auto-deploy from GitHub
# 5. Monitor logs for any errors
# 6. Test in production
```

**That's it!** Both platforms watch GitHub and auto-deploy on push.

---

## 💬 Quick Reference

| Service | Purpose | Free Tier | Deploy Time |
|---------|---------|-----------|------------|
| Render | Backend API | Yes (pauses after 15 min inactive) | 5-10 min |
| Vercel | Frontend | Yes (unlimited) | 2-3 min |
| MongoDB Atlas | Database | Yes (512 MB) | Instant |
| GitHub | Version Control | Yes (unlimited) | - |

---

## 🆘 Getting Help

1. **Check logs** in Render/Vercel dashboards
2. **Review PRODUCTION_DEPLOYMENT_GUIDE.md** in root folder
3. **Check GitHub** for similar issues
4. **Test locally first** before deploying
5. **Contact support** in Render/Vercel dashboard

---

**You're all set for production deployment!** 🎉

If any issues, check:
1. Backend logs in Render
2. Frontend logs in browser console
3. Network tab for API requests
4. Environment variables in platforms
