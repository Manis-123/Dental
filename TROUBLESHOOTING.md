# Production Troubleshooting & FAQ

## 🚨 Critical Issues

### 1. Cannot Login (401 Error)

**Error Message:**
```
Unauthorized - Please login again
```

**Causes & Fixes:**

#### Cause A: JWT_SECRET mismatch
- Backend and frontend have different secrets
- **Fix:**
  1. In Render dashboard, go to Service → Environment
  2. Check JWT_SECRET value
  3. Generate new: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
  4. Update in Render
  5. Redeploy backend

#### Cause B: Token expired
- JWT tokens expire after 7 days
- **Fix:** User needs to login again (automatic in app)

#### Cause C: Admin user doesn't exist
- Default admin not created
- **Fix:**
  1. Run locally: `node backend/createAdmin.js`
  2. Database now has admin
  3. Try login with: `admin@dental.com` / `admin123`

#### Cause D: Wrong environment variable name
- Check if JWT_SECRET is set (not JW_TTOKEN or similar)
- **Fix:** Copy exact names from `.env.example`

---

### 2. CORS Error (Access Blocked)

**Error Message:**
```
Access to XMLHttpRequest at 'https://api.example.com' has been blocked by CORS policy: 
Response to preflight request doesn't pass access control check
```

**Causes & Fixes:**

#### Cause A: Frontend domain not in CLIENT_URL
- Frontend makes request but not in allowed list
- **Fix:**
  1. Render dashboard → Service → Environment
  2. Find CLIENT_URL
  3. Add your Vercel domain:
     ```
     https://yourdomain.vercel.app,https://www.yourdomain.com
     ```
  4. Save and redeploy

#### Cause B: Missing https://
- Must use full URL with protocol
- **Fix:**
  ```
  ❌ yourdomain.vercel.app
  ✅ https://yourdomain.vercel.app
  ```

#### Cause C: Trailing slash issue
- URL has trailing slash but doesn't match
- **Fix:**
  ```
  ❌ https://yourdomain.vercel.app/
  ✅ https://yourdomain.vercel.app
  ```

#### Cause D: Wrong backend URL in frontend
- Frontend pointing to wrong API
- **Fix:**
  1. Vercel dashboard → Settings → Environment
  2. Check VITE_API_URL
  3. Should be: `https://your-backend.onrender.com/api`
  4. Redeploy

**Test CORS:**
```bash
curl -H "Origin: https://yourdomain.vercel.app" \
  -H "Access-Control-Request-Method: POST" \
  https://api-backend.onrender.com/api/health -v
```

---

### 3. API Returns 404 Not Found

**Error Message:**
```
404: Route not found
```

**Causes & Fixes:**

#### Cause A: Wrong API URL format
- Frontend using wrong endpoint
- **Fix:**
  - Development: `/api/...` (proxy handles it)
  - Production: `https://backend.com/api/...` (full URL)
  - Check VITE_API_URL in Vercel

#### Cause B: Route doesn't exist
- Endpoint name is wrong
- **Fix:**
  1. Check backend routes: `backend/routes/`
  2. Verify endpoint exists
  3. Check request path in network tab

#### Cause C: Backend not deployed correctly
- Routes not loaded
- **Fix:**
  1. Check Render logs for errors
  2. Redeploy if needed

---

### 4. Network Timeout

**Error Message:**
```
Request timeout - Server took too long to respond
```

**Causes & Fixes:**

#### Cause A: Backend is sleeping (free Render tier)
- Free tier pauses after 15 minutes inactivity
- **Fix:**
  1. Upgrade to paid Render plan
  2. Or keep service warm with monitoring

#### Cause B: Very slow MongoDB response
- Database query is slow
- **Fix:**
  1. Check MongoDB indexes
  2. Optimize query
  3. Consider paid MongoDB tier

#### Cause C: Network latency
- Server is far away
- **Fix:**
  1. Choose deployment region closer to users
  2. In Render: Select nearest region during deploy

#### Cause D: Large data transfer
- Response is too large
- **Fix:**
  1. Add pagination to endpoints
  2. Limit results returned
  3. Compress response

**Increase timeout:**
```javascript
// In frontend/src/api.js
this.timeout = 30000; // 30 seconds instead of 15
```

---

## ⚠️ Data & Authentication Issues

### 5. User Can't See Their Data

**Problem:** Login works but no data shows up

**Causes & Fixes:**

#### Cause A: clinicId not set
- User needs clinic assignment
- **Fix:**
  1. Admin adds clinic
  2. Admin assigns user to clinic
  3. User re-login

#### Cause B: Wrong clinic selected
- User picking wrong clinic
- **Fix:**
  1. Check clinic selector in app
  2. Make sure right clinic is selected
  3. Refresh page

#### Cause C: Database empty
- No data entered yet
- **Fix:**
  1. Run seed: `node backend/seed.js` (if available)
  2. Add data manually through UI

---

### 6. Cannot Create Records (500 Error)

**Error Message:**
```
500: Server error / Unknown error occurred
```

**Causes & Fixes:**

#### Cause A: Validation error
- Required field missing
- **Fix:**
  1. Check browser console for details
  2. Check all required fields are filled
  3. Check data types (email format, numbers, etc.)

#### Cause B: Database constraint error
- Duplicate entry or invalid reference
- **Fix:**
  1. Check backend logs in Render
  2. Don't duplicate unique fields (email, etc.)
  3. Make sure referenced records exist

#### Cause C: File upload too large
- Image/file exceeds 10MB limit
- **Fix:**
  1. Compress image before upload
  2. Maximum size is 10MB
  3. Use jpg/png format

---

### 7. Image Upload Fails

**Problem:** Can't upload patient images

**Causes & Fixes:**

#### Cause A: File too large
- Exceeds 10MB limit
- **Fix:**
  1. Compress image
  2. Use online tool: tinypng.com
  3. Try smaller resolution

#### Cause B: Wrong file format
- Only jpg/png accepted
- **Fix:**
  1. Convert to jpg/png
  2. Don't use bmp, gif, webp, etc.

#### Cause C: Upload endpoint error
- Backend can't handle request
- **Fix:**
  1. Check Render logs
  2. Make sure `/api/patients/:id/images` endpoint exists
  3. Restart service

---

## 📱 Mobile & Browser Issues

### 8. Works on Desktop but Not Mobile

**Problem:** Login/API works on desktop but fails on phone

**Causes & Fixes:**

#### Cause A: Different network
- Mobile on different wifi/4G than desktop
- **Fix:**
  1. Check if mobile can reach https://api.backend.com/api/health
  2. Try on different network (phone hotspot)
  3. Check firewall/VPN

#### Cause B: Browser cache
- Old cached data
- **Fix:**
  1. Clear browser cache (Settings → Clear Data)
  2. Close and reopen browser
  3. Logout and login again

#### Cause C: Cookies not working
- Mobile browser blocks cookies
- **Fix:**
  1. Check privacy settings
  2. Ensure API sends credentials: `credentials: 'include'`

---

### 9. API Works Locally but Not in Production

**Problem:** `npm run dev` works but production fails

**Causes & Fixes:**

#### Cause A: Environment variables not set
- Works locally because .env is loaded
- **Fix:**
  1. Add same variables to Render/Vercel
  2. Double-check spelling
  3. Redeploy

#### Cause B: Different node version
- Local uses different Node version
- **Fix:**
  1. Specify version in Render settings
  2. Use same version locally: `node -v`

#### Cause C: Missing dependencies
- npm install didn't run on server
- **Fix:**
  1. Check Render logs for install errors
  2. Clear cache and rebuild
  3. Commit package-lock.json

---

## 🔧 Performance Issues

### 10. App is Very Slow

**Problem:** Production is slow compared to local

**Causes & Fixes:**

#### Cause A: Database queries too slow
- Complex queries taking time
- **Fix:**
  1. Add database indexes
  2. Use pagination (limit results)
  3. Upgrade MongoDB to paid tier

#### Cause B: Large JavaScript bundle
- Frontend too large
- **Fix:**
  1. Build and check size: `npm run build`
  2. Remove unused dependencies
  3. Enable compression

#### Cause C: Server is far away
- Latency issue
- **Fix:**
  1. Choose region closer to users
  2. Use CDN for frontend (Vercel does this)

#### Cause D: Free tier throttling
- Free tier has limited resources
- **Fix:**
  1. Upgrade to paid plan
  2. Or accept slower performance

---

## 📝 Common Error Messages

| Error | Cause | Fix |
|-------|-------|-----|
| `401 Unauthorized` | Token expired/invalid | Re-login |
| `403 Forbidden` | Not admin/not authorized | Check role in database |
| `404 Not Found` | Route doesn't exist | Check endpoint path |
| `500 Server Error` | Backend error | Check Render logs |
| `CORS blocked` | Domain not allowed | Add to CLIENT_URL |
| `Timeout` | Server too slow | Upgrade plan or wait |
| `Cannot connect` | Network issue | Check internet/firewall |

---

## 🔍 Debugging Steps

### For Any Issue, Follow This:

1. **Check browser console**
   - F12 → Console tab
   - Look for error messages

2. **Check Network tab**
   - F12 → Network tab
   - See if API request is being sent
   - Check response status (200, 401, 404, 500, etc.)

3. **Check backend logs**
   - Render dashboard → Service → Logs
   - Look for error stack trace

4. **Test API directly**
   ```bash
   # Test health
   curl https://your-backend.onrender.com/api/health
   
   # Test login
   curl -X POST https://your-backend.onrender.com/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"admin@dental.com","password":"admin123"}'
   ```

5. **Check environment variables**
   - Render: Dashboard → Environment
   - Vercel: Settings → Environment Variables
   - Ensure all required vars are set

6. **Restart services**
   - Render: Manual Redeploy
   - Vercel: Redeploy
   - Clear cache before redeploying

---

## ✅ Verification Checklist

Use this to verify everything is working:

- [ ] Backend health endpoint returns 200: `https://api.onrender.com/api/health`
- [ ] Frontend loads without errors: `https://domain.vercel.app`
- [ ] Can login with admin credentials
- [ ] Admin panel accessible at `/admin`
- [ ] Can create new patient
- [ ] Can create new appointment
- [ ] Can create new bill
- [ ] Reports page loads data
- [ ] Can logout and login again
- [ ] All pages work on mobile
- [ ] No console errors (F12)
- [ ] Network tab shows correct API URL
- [ ] HTTPS works (not HTTP)

---

## 📞 Getting Help

If you still have issues:

1. **Check this file** for your error
2. **Review PRODUCTION_DEPLOYMENT_GUIDE.md** for architecture
3. **Read DEPLOYMENT_STEPS.md** for step-by-step instructions
4. **Contact:**
   - Render support: https://render.com/support
   - Vercel support: https://vercel.com/help
   - MongoDB support: https://www.mongodb.com/support

---

## 💾 Backup & Recovery

### Regular Backups

1. **MongoDB Atlas**
   - Automatic daily backups (paid tier)
   - Manual backups available

2. **GitHub**
   - All code automatically backed up
   - Can restore from any commit

3. **Render**
   - No automatic code backup
   - Use GitHub as backup source

### Recovery Process

1. **If database corrupted:**
   - Restore from MongoDB backup
   - Or reset and re-seed

2. **If code broken:**
   - Revert GitHub commit
   - Redeploy to Render/Vercel

3. **If service deleted:**
   - Code is in GitHub
   - Database is in MongoDB Atlas
   - Recreate service from scratch

---

**Last Updated:** May 2026
**Status:** Production Ready ✅
