# Netlify Deployment Guide

## 📋 Prerequisites
- GitHub account with your project pushed
- Netlify account (free at netlify.com)
- Backend deployed on Render, Railway, or similar service

---

## 🚀 Step 1: Deploy Frontend to Netlify

### Option A: Connect GitHub (Recommended)

1. **Visit Netlify Dashboard**
   - Go to https://app.netlify.com/
   - Click "Add new site" → "Import an existing project"

2. **Connect GitHub**
   - Select GitHub as provider
   - Authorize Netlify to access your repositories
   - Select your `dental` repository

3. **Configure Build Settings**
   ```
   Build Command: npm run build
   Publish Directory: frontend/dist
   Base Directory: frontend
   ```

4. **Add Environment Variables**
   - Click "Environment" → "Edit Variables"
   - Add: `VITE_API_URL` = `https://your-backend.onrender.com`
   - (Replace with your actual backend URL)

5. **Deploy**
   - Click "Deploy Site"
   - Wait 2-3 minutes for build to complete
   - You'll get a URL like: `https://yoursite.netlify.app`

### Option B: Manual Deployment (Using Netlify CLI)

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build frontend
cd frontend
npm run build

# Deploy
netlify deploy --prod --dir=dist

# Set environment variable
netlify env:set VITE_API_URL https://your-backend.onrender.com
```

---

## 🖥️ Step 2: Deploy Backend to Render (or Railway)

### Using Render.com

1. **Create Render Account**
   - Go to https://render.com/
   - Sign up with GitHub

2. **Create Web Service**
   - Click "New+" → "Web Service"
   - Connect your GitHub repo
   - Select `dental` repository

3. **Configure Service**
   ```
   Name: dental-backend
   Root Directory: backend
   Build Command: npm install
   Start Command: node server.js
   ```

4. **Add Environment Variables**
   ```
   MONGODB_URI=mongodb+srv://m33842121_db_user:patidar@cluster0.n2lwfcm.mongodb.net/dental_clinic?retryWrites=true&w=majority&appName=Cluster0
   JWT_SECRET=baa2936779b57ba35b2f3dbef5299ab6f55974b6cf1f0090e8fd80bbe00296ca
   CLIENT_URL=https://yoursite.netlify.app
   NODE_ENV=production
   PORT=4000
   ```

5. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete
   - Get your backend URL: `https://your-backend.onrender.com`

---

## 🔄 Step 3: Update Frontend Environment Variable

Once backend is deployed:

1. **In Netlify Dashboard**
   - Go to your site settings
   - Click "Environment"
   - Update `VITE_API_URL` to your Render backend URL
   - Example: `https://dental-backend.onrender.com`

2. **Trigger Rebuild**
   - Go to "Deploys" tab
   - Click "Trigger deploy" → "Deploy site"

---

## ✅ Step 4: Verify Deployment

### Test Frontend
```
1. Visit: https://yoursite.netlify.app
2. You should see landing page
3. Click Login
4. Try to login (should connect to backend)
```

### Test Backend API
```
curl https://your-backend.onrender.com/api/health
```

### Check Browser Console (F12)
- Should show: `[API] Base URL: https://your-backend.onrender.com`
- No CORS errors should appear

---

## 🔧 Troubleshooting

### Issue: Build Fails on Netlify
**Solution:**
- Check build logs in Netlify dashboard
- Ensure `frontend` is correct folder
- Verify `npm run build` works locally

### Issue: API Calls Return 404
**Solution:**
- Verify `VITE_API_URL` is set correctly in Netlify
- Check backend is running (test health endpoint)
- Verify CORS is configured: `CLIENT_URL=https://yoursite.netlify.app`

### Issue: CORS Errors
**Solution:**
- In Render backend environment variables
- Update `CLIENT_URL` to match Netlify domain
- Restart backend service

### Issue: Blank Page or 404
**Solution:**
- netlify.toml redirects are configured
- Clear browser cache (Ctrl+Shift+Delete)
- Check if JavaScript is enabled

---

## 📊 Environment Variables Summary

### Frontend (Netlify)
```
VITE_API_URL=https://your-backend.onrender.com
```

### Backend (Render)
```
MONGODB_URI=<your-mongodb-connection-string>
JWT_SECRET=<32-character-secret>
CLIENT_URL=https://yoursite.netlify.app
NODE_ENV=production
PORT=4000
```

---

## 🔐 Important Security Notes

1. **Never commit .env files** - already in .gitignore
2. **Use strong JWT_SECRET** - 32+ random characters
3. **Keep MongoDB credentials safe** - use environment variables only
4. **Enable HTTPS** - Netlify/Render do this automatically
5. **Monitor CORS** - only allow your frontend domain

---

## 📱 After Deployment

### Create Admin User
```bash
# SSH into Render backend or run locally with production DB
node backend/createAdmin.js

# Or manually add user via MongoDB
db.users.insertOne({
  name: "Admin",
  email: "admin@dental.com",
  password: <hashed>,
  role: "admin"
})
```

### Update DNS (Optional)
For custom domain:
1. Update domain nameservers to Netlify
2. Set backend DNS to Render
3. Verify in each platform's dashboard

---

## 🎯 Your Deployment URLs (Update After Deploying)

```
Frontend: https://yoursite.netlify.app
Backend API: https://your-backend.onrender.com
Login: https://yoursite.netlify.app/login
Admin Panel: https://yoursite.netlify.app/admin
```

---

**Deployment Time:** ~15-20 minutes total  
**Cost:** Free tier available for both Netlify & Render
