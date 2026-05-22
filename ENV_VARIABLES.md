# Environment Variables Configuration for Production

## Frontend (.env.production or Netlify Environment Variables)

```
VITE_API_URL=https://your-backend-url.onrender.com
```

### How to Set in Netlify:
1. Go to Netlify Dashboard
2. Select your site
3. Settings → Build & Deploy → Environment
4. Click "Edit Variables"
5. Add `VITE_API_URL` with your backend URL

---

## Backend (.env file)

```
# Database
MONGODB_URI=mongodb+srv://m33842121_db_user:patidar@cluster0.n2lwfcm.mongodb.net/dental_clinic?retryWrites=true&w=majority&appName=Cluster0

# Security
JWT_SECRET=baa2936779b57ba35b2f3dbef5299ab6f55974b6cf1f0090e8fd80bbe00296ca

# CORS Configuration
CLIENT_URL=https://yoursite.netlify.app

# Server Configuration
PORT=4000
NODE_ENV=production
```

### How to Set in Render:
1. Go to Render Dashboard
2. Select your service
3. Settings → Environment
4. Add all variables above
5. Click Save

---

## Local Development

### Frontend (.env.local - not committed)
```
VITE_API_URL=http://localhost:4000
```

### Backend (.env - already set)
```
PORT=4000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=...
CLIENT_URL=http://localhost:3001
NODE_ENV=development
```

---

## Important Notes

✅ Never commit actual .env files  
✅ Keep JWT_SECRET and database credentials safe  
✅ Update CLIENT_URL when deploying to production  
✅ Use HTTPS URLs only in production  
✅ Regenerate JWT_SECRET for production if using this locally  

---

## Generate New JWT_SECRET (if needed)

```bash
# On Windows PowerShell:
[Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32))

# Or in Node.js:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
