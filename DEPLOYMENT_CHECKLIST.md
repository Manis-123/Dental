# ✅ Netlify Deployment Checklist

## Pre-Deployment (Local Testing)

- [ ] Frontend builds successfully: `npm run build`
- [ ] Backend server starts: `node backend/server.js`
- [ ] Can login locally with test credentials
- [ ] API calls work in browser (check Network tab)
- [ ] No console errors in F12

---

## Frontend Deployment (Netlify)

### Setup
- [ ] GitHub account ready with project pushed
- [ ] Netlify account created at netlify.com
- [ ] SSH keys configured (if needed)

### Netlify Configuration
- [ ] Signed into Netlify
- [ ] Created new site from GitHub
- [ ] Repository selected correctly
- [ ] Base directory: `frontend`
- [ ] Build command: `npm run build`
- [ ] Publish directory: `frontend/dist`

### Environment Variables
- [ ] Added `VITE_API_URL` variable
- [ ] Value set to backend URL (after backend deployed)
- [ ] Saved environment variables

### Deployment
- [ ] Build completed without errors
- [ ] Frontend URL generated (netlify.app domain)
- [ ] Site is live and accessible

---

## Backend Deployment (Render.com or Railway)

### Setup
- [ ] Render or Railway account created
- [ ] Signed in with GitHub
- [ ] Repository connected

### Service Configuration
- [ ] Created Web Service/App
- [ ] Root directory set to: `backend`
- [ ] Build command: `npm install`
- [ ] Start command: `node server.js`

### Environment Variables
- [ ] `MONGODB_URI` added
- [ ] `JWT_SECRET` added
- [ ] `CLIENT_URL` set to Netlify frontend URL
- [ ] `NODE_ENV` set to `production`
- [ ] `PORT` set to `4000`

### Deployment
- [ ] Service deployed successfully
- [ ] Backend URL obtained (onrender.com domain)
- [ ] Health endpoint works: `https://backend.onrender.com/api/health`

---

## Post-Deployment Configuration

### Update Frontend Variables
- [ ] Went back to Netlify dashboard
- [ ] Updated `VITE_API_URL` to actual backend URL
- [ ] Triggered new deployment

### Update Backend CORS
- [ ] Verified `CLIENT_URL` in Render is correct
- [ ] Backend restarted (Render auto-restarts on env change)

### Testing
- [ ] Frontend loads at https://yoursite.netlify.app
- [ ] Can see landing page
- [ ] Can navigate to login page
- [ ] Backend API responds to requests
- [ ] No CORS errors in F12
- [ ] Can login successfully

---

## Admin User Setup

- [ ] Ran `node backend/createAdmin.js` (if needed)
- [ ] Or created user via MongoDB directly
- [ ] Default credentials:
  - Email: `admin@dental.com`
  - Password: `admin123`
- [ ] Successfully logged in as admin

---

## Verification Tests

### Health Checks
```
✓ Frontend loads without errors
✓ API endpoint responds: /api/health
✓ Database connection works
✓ JWT tokens are issued
✓ Authentication works
```

### Functional Tests
- [ ] Landing page displays correctly
- [ ] Login form works
- [ ] Can login with admin credentials
- [ ] Dashboard loads after login
- [ ] API calls work (check Network tab)
- [ ] No 404 or CORS errors

### Security Checks
- [ ] HTTPS is enabled (automatic)
- [ ] .env files not in repository
- [ ] Sensitive data in environment variables only
- [ ] JWT secret is secure
- [ ] Database credentials not exposed

---

## Troubleshooting

If deployment fails:

1. **Check Netlify build logs**
   - Go to Deployes → Click failed build
   - Look for error messages

2. **Check Render logs**
   - Go to service → Logs
   - Look for startup errors

3. **Verify environment variables**
   - Make sure all required vars are set
   - Check for typos

4. **Test backend independently**
   - Use curl or Postman to test API
   - Check if backend is running

5. **Check CORS configuration**
   - Verify `CLIENT_URL` matches frontend domain
   - Ensure `server.js` has CORS enabled

---

## Next Steps (Optional)

- [ ] Set up custom domain
- [ ] Configure email notifications
- [ ] Set up automatic backups
- [ ] Monitor application performance
- [ ] Set up error tracking (Sentry, etc.)

---

## URLs After Deployment

**Frontend:** https://yoursite.netlify.app
**Backend:** https://yourbackend.onrender.com
**Admin Panel:** https://yoursite.netlify.app/admin

---

**Estimated Time:** 20-30 minutes  
**Cost:** Free (both Netlify & Render have free tiers)
