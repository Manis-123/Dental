# 🚀 Quick Netlify Deployment Guide (30 Minutes)

## Step 1️⃣: Local Testing (5 min)

```bash
# Terminal 1 - Backend
cd backend
npm install
node server.js
# Should show: ✓ Server running on port 4000

# Terminal 2 - Frontend  
cd frontend
npm install
npm run build
npm run dev
# Should show: ✓ Local:   http://localhost:3001
```

✅ Test locally at http://localhost:3001

---

## Step 2️⃣: Push to GitHub (2 min)

```bash
# In project root
git add .
git commit -m "Ready for Netlify deployment"
git push origin main
```

---

## Step 3️⃣: Deploy Frontend (10 min)

### On Netlify.com:

1. Sign up/Login at **https://app.netlify.com**

2. Click **"Add new site"** → **"Import an existing project"**

3. Connect **GitHub** → Select your **dental** repo

4. Build settings:
   ```
   Base directory: frontend
   Build command: npm run build
   Publish directory: frontend/dist
   ```

5. Click **"Deploy site"**

6. Wait 2-3 minutes...

7. Get your **Netlify URL** (like `https://amazing-site-12345.netlify.app`)

---

## Step 4️⃣: Deploy Backend (10 min)

### On Render.com:

1. Sign up/Login at **https://render.com** (with GitHub)

2. Click **"New+"** → **"Web Service"**

3. Connect your **dental** repository

4. Configure:
   ```
   Name: dental-backend
   Root Directory: backend
   Build: npm install
   Start: node server.js
   ```

5. **Environment Variables** (click "Advanced"):
   ```
   MONGODB_URI=mongodb+srv://m33842121_db_user:patidar@cluster0.n2lwfcm.mongodb.net/dental_clinic?retryWrites=true&w=majority&appName=Cluster0
   
   JWT_SECRET=baa2936779b57ba35b2f3dbef5299ab6f55974b6cf1f0090e8fd80bbe00296ca
   
   CLIENT_URL=https://YOUR-NETLIFY-SITE.netlify.app
   
   NODE_ENV=production
   
   PORT=4000
   ```

6. Click **"Deploy"**

7. Wait 5-10 minutes...

8. Get your **Render URL** (like `https://dental-backend.onrender.com`)

---

## Step 5️⃣: Connect Frontend to Backend (3 min)

### Back on Netlify.com:

1. Go to your site → **"Site settings"** → **"Build & deploy"** → **"Environment"**

2. Click **"Edit Variables"**

3. Add:
   ```
   VITE_API_URL = https://YOUR-BACKEND.onrender.com
   ```

4. Click **"Redeploy site"** → **"Redeploy"**

---

## ✅ Testing (1 min)

### In Browser:

1. Visit your **Netlify URL**: `https://your-site.netlify.app`
2. Click **Login**
3. Enter:
   - Email: `admin@dental.com`
   - Password: `admin123`
4. Should see **Dashboard** ✓

### If Errors:

Press **F12** → Check **Console** for error messages

---

## 🎉 Done!

| What | Where |
|------|-------|
| **Frontend** | `https://your-site.netlify.app` |
| **Backend** | `https://your-backend.onrender.com` |
| **Login** | `https://your-site.netlify.app/login` |

---

## ⚠️ Common Issues

| Issue | Fix |
|-------|-----|
| Build fails | Check Netlify logs, ensure `npm run build` works locally |
| API not responding | Check `VITE_API_URL` is correct in Netlify env vars |
| CORS error | Make sure `CLIENT_URL` in Render matches your Netlify domain |
| Blank page | Clear browser cache, check F12 console for errors |

---

## 📞 Need Help?

- Netlify Docs: https://docs.netlify.com
- Render Docs: https://render.com/docs
- Check `.md` files in project root for detailed guides
