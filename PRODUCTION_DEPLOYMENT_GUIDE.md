# Production Deployment Guide - Dental Clinic System

## 📋 Overview
Connect React Frontend (Vercel) with Node.js Backend (Render/Railway) for production.

---

## 🔧 Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    USER BROWSER                          │
└────────────────────┬────────────────────────────────────┘
                     │
        ┌────────────┴────────────┐
        │                         │
┌───────▼──────────────┐  ┌──────▼──────────────┐
│   VERCEL             │  │  Static Files      │
│ (Frontend React)     │  │  index.html, JS    │
│ dentalclinic.com     │  │  CSS               │
└───────┬──────────────┘  └────────────────────┘
        │
        │ API Requests (HTTPS)
        │ /api/auth/login
        │ /api/patients
        │ /api/appointments etc.
        │
┌───────▼──────────────────────────────┐
│  RENDER / RAILWAY BACKEND             │
│  (Node.js Express + MongoDB)          │
│  backend-api.onrender.com             │
│                                       │
│  ├─ Routes: /api/*                    │
│  ├─ CORS: Allows vercel domain        │
│  ├─ JWT: Token authentication         │
│  ├─ MongoDB: Database                 │
│  └─ HTTPS: Secure connection          │
└───────────────────────────────────────┘
```

---

## 🚀 Step 1: Backend Setup (Render/Railway)

### Backend .env Configuration
Create `backend/.env`:

```env
# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dental_clinic

# Server
PORT=3000
NODE_ENV=production

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# CORS - Frontend URL
CLIENT_URL=https://dentalclinic.vercel.app,https://dentalclinic.com

# Environment
ENVIRONMENT=production
LOG_LEVEL=info
```

### Backend server.js (Updated for Production)

```javascript
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables FIRST
dotenv.config({ path: path.join(__dirname, '.env') });

import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';
import { errorHandler } from './middleware/errorHandler.js';
import { protect, adminOnly } from './middleware/auth.js';
import { attachClinic } from './middleware/clinicScope.js';
import { ensureDefaultClinic } from './utils/ensureDefaultClinic.js';

// Import all routes
import userRoutes from './routes/userRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import authRoutes from './routes/authRoutes.js';
import patientRoutes from './routes/patientRoutes.js';
import doctorRoutes from './routes/doctorRoutes.js';
import treatmentRoutes from './routes/treatmentRoutes.js';
import appointmentRoutes from './routes/appointmentRoutes.js';
import statsRoutes from './routes/statsRoutes.js';
import billRoutes from './routes/billRoutes.js';
import clinicRoutes from './routes/clinicRoutes.js';
import inventoryRoutes from './routes/inventoryRoutes.js';
import expenseRoutes from './routes/expenseRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import reminderRoutes from './routes/reminderRoutes.js';

const app = express();
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// ========== CORS Configuration ==========
const allowedOrigins = process.env.CLIENT_URL?.split(',').map((url) => url.trim()).filter(Boolean) || [];

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests without origin (mobile apps, server-to-server)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`CORS blocked request from: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // Allow cookies
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Clinic-Id'],
};

app.use(cors(corsOptions));

// ========== Middleware ==========
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

// ========== Health Check ==========
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Dental Clinic API is running',
    environment: NODE_ENV,
    timestamp: new Date().toISOString()
  });
});

// ========== Public Routes ==========
app.use('/api/auth', authRoutes);

// ========== Protected Routes (All Authenticated Users) ==========
const protectedApi = express.Router();
protectedApi.use(protect, attachClinic);
protectedApi.use('/clinics', clinicRoutes);
protectedApi.use('/patients', patientRoutes);
protectedApi.use('/doctors', doctorRoutes);
protectedApi.use('/treatments', treatmentRoutes);
protectedApi.use('/appointments', appointmentRoutes);
protectedApi.use('/stats', statsRoutes);
protectedApi.use('/bills', billRoutes);
protectedApi.use('/inventory', inventoryRoutes);
protectedApi.use('/expenses', expenseRoutes);
protectedApi.use('/reports', reportRoutes);
protectedApi.use('/reminders', reminderRoutes);

// ========== Admin-Only Routes ==========
const adminApi = express.Router();
adminApi.use(protect, adminOnly, attachClinic);
adminApi.use('/users', userRoutes);
adminApi.use('/admin', adminRoutes);

app.use('/api', protectedApi);
app.use('/api', adminApi);

// ========== 404 Handler ==========
app.use((req, res) => {
  res.status(404).json({ 
    message: 'Route not found',
    path: req.path,
    method: req.method
  });
});

// ========== Error Handler (MUST BE LAST) ==========
app.use(errorHandler);

// ========== Server Startup ==========
connectDB()
  .then(async () => {
    await ensureDefaultClinic();
    app.listen(PORT, () => {
      console.log(`
✅ Server running on port ${PORT}
📡 Environment: ${NODE_ENV}
🌍 Allowed Origins: ${allowedOrigins.join(', ') || 'All origins'}
      `);
    });
  })
  .catch((err) => {
    console.error('❌ Failed to connect to MongoDB:', err.message);
    process.exit(1);
  });
```

---

## 🎨 Step 2: Frontend Setup (Vercel)

### Frontend .env Configuration
Create `frontend/.env`:

```env
# Development
VITE_API_URL=http://localhost:4000/api

# Production (Vercel)
VITE_API_URL=https://your-backend.onrender.com/api
```

For Vercel environment variables, add in Vercel dashboard:
- Settings → Environment Variables
- Add: `VITE_API_URL=https://your-backend.onrender.com/api`

### Frontend vite.config.js (Updated)

```javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3001,
    // Dev proxy to backend
    proxy: {
      '/api': {
        target: process.env.VITE_API_URL || 'http://localhost:4000',
        changeOrigin: true,
      },
    },
  },
  // Build configuration
  build: {
    outDir: 'dist',
    sourcemap: false, // Disable in production for security
    minify: 'terser',
  },
  define: {
    // Define environment at build time
    'process.env.VITE_API_URL': JSON.stringify(
      process.env.VITE_API_URL || '/api'
    ),
  },
});
```

### Frontend api.js (Updated for Production)

```javascript
// Get API URL from environment or use relative path
const API_BASE = import.meta.env.VITE_API_URL || '/api';

class APIClient {
  constructor() {
    this.baseURL = API_BASE;
    this.token = null;
    this.timeout = 15000; // 15 second timeout
    
    // Load token from localStorage if exists
    if (typeof localStorage !== 'undefined') {
      this.token = localStorage.getItem('token');
    }
  }

  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }

  async request(path, options = {}) {
    const url = `${this.baseURL}${path}`;
    
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    // Add JWT token if exists
    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    // Add clinic ID header if exists
    const clinicId = typeof localStorage !== 'undefined' ? localStorage.getItem('clinicId') : null;
    if (clinicId) {
      headers['X-Clinic-Id'] = clinicId;
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(url, {
        ...options,
        headers,
        signal: controller.signal,
        credentials: 'include', // Send cookies
      });

      clearTimeout(timeoutId);

      // Handle 401 - Unauthorized (token expired/invalid)
      if (response.status === 401) {
        this.setToken(null);
        localStorage.removeItem('user');
        
        // Redirect to login if in browser
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        throw new Error('Unauthorized - Please login again');
      }

      // Parse response
      const contentType = response.headers.get('content-type');
      let data = {};
      
      if (contentType?.includes('application/json')) {
        data = await response.json();
      } else {
        data = { message: await response.text() };
      }

      // Handle errors
      if (!response.ok) {
        const error = new Error(data.message || `HTTP ${response.status}`);
        error.status = response.status;
        error.data = data;
        throw error;
      }

      return data;
    } catch (error) {
      // Handle network errors
      if (error.name === 'AbortError') {
        throw new Error('Request timeout - Server took too long to respond');
      }
      
      if (error instanceof TypeError) {
        throw new Error(`Network error: ${error.message}`);
      }

      throw error;
    }
  }

  // Authentication
  login(email, password) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  register(body) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  getMe() {
    return this.request('/auth/me');
  }

  // Patients
  getPatients() {
    return this.request('/patients');
  }

  getPatient(id) {
    return this.request(`/patients/${id}`);
  }

  createPatient(body) {
    return this.request('/patients', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  updatePatient(id, body) {
    return this.request(`/patients/${id}`, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  deletePatient(id) {
    return this.request(`/patients/${id}`, {
      method: 'DELETE',
    });
  }

  // Doctors
  getDoctors() {
    return this.request('/doctors');
  }

  createDoctor(body) {
    return this.request('/doctors', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  deleteDoctor(id) {
    return this.request(`/doctors/${id}`, {
      method: 'DELETE',
    });
  }

  // Appointments
  getAppointments() {
    return this.request('/appointments');
  }

  createAppointment(body) {
    return this.request('/appointments', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  updateAppointment(id, body) {
    return this.request(`/appointments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  deleteAppointment(id) {
    return this.request(`/appointments/${id}`, {
      method: 'DELETE',
    });
  }

  // Bills
  getBills() {
    return this.request('/bills');
  }

  getBill(id) {
    return this.request(`/bills/${id}`);
  }

  createBill(body) {
    return this.request('/bills', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  updateBill(id, body) {
    return this.request(`/bills/${id}`, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  deleteBill(id) {
    return this.request(`/bills/${id}`, {
      method: 'DELETE',
    });
  }

  // Admin
  getAdminOverview() {
    return this.request('/admin/overview');
  }

  getUsers() {
    return this.request('/users');
  }

  createUser(body) {
    return this.request('/users', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  updateUser(id, body) {
    return this.request(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  deleteUser(id) {
    return this.request(`/users/${id}`, {
      method: 'DELETE',
    });
  }

  // Clinics
  getClinics() {
    return this.request('/clinics');
  }

  createClinic(body) {
    return this.request('/clinics', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  updateClinic(id, body) {
    return this.request(`/clinics/${id}`, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  deleteClinic(id) {
    return this.request(`/clinics/${id}`, {
      method: 'DELETE',
    });
  }

  // Treatments
  getTreatments() {
    return this.request('/treatments');
  }

  createTreatment(body) {
    return this.request('/treatments', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  deleteTreatment(id) {
    return this.request(`/treatments/${id}`, {
      method: 'DELETE',
    });
  }

  // Inventory
  getInventory() {
    return this.request('/inventory');
  }

  createInventory(body) {
    return this.request('/inventory', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  updateInventory(id, body) {
    return this.request(`/inventory/${id}`, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  deleteInventory(id) {
    return this.request(`/inventory/${id}`, {
      method: 'DELETE',
    });
  }

  // Expenses
  getExpenses() {
    return this.request('/expenses');
  }

  createExpense(body) {
    return this.request('/expenses', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  deleteExpense(id) {
    return this.request(`/expenses/${id}`, {
      method: 'DELETE',
    });
  }

  // Reports
  getMonthlyReport(year, month) {
    return this.request(`/reports/monthly?year=${year}&month=${month}`);
  }

  // Stats
  getStats() {
    return this.request('/stats');
  }

  // Reminders
  getTomorrowReminders() {
    return this.request('/reminders/tomorrow');
  }

  sendReminder(appointmentId, channel = 'whatsapp') {
    return this.request(`/reminders/appointment/${appointmentId}`, {
      method: 'POST',
      body: JSON.stringify({ channel }),
    });
  }

  sendTomorrowReminders(channel = 'whatsapp') {
    return this.request('/reminders/tomorrow', {
      method: 'POST',
      body: JSON.stringify({ channel }),
    });
  }

  getReminderLogs() {
    return this.request('/reminders/logs');
  }

  // Treatments & Patients
  getTreatments() {
    return this.request('/treatments');
  }

  getPatientHistory(id) {
    return this.request(`/patients/${id}/history`);
  }

  getPatientImages(patientId) {
    return this.request(`/patients/${patientId}/images`);
  }

  addPatientImage(patientId, body) {
    return this.request(`/patients/${patientId}/images`, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  deletePatientImage(patientId, imageId) {
    return this.request(`/patients/${patientId}/images/${imageId}`, {
      method: 'DELETE',
    });
  }
}

export const api = new APIClient();

// Auto-load token from localStorage
const savedToken = typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null;
if (savedToken) {
  api.setToken(savedToken);
}
```

---

## 🔐 Step 3: Authentication & JWT Handling

### Backend - Enhanced auth.js

```javascript
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { asyncHandler } from './asyncHandler.js';

const JWT_SECRET = process.env.JWT_SECRET || 'dental_secret_key';
const JWT_EXPIRE = '7d';

export const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Get token from header
  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized - No token' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    
    if (!req.user) {
      return res.status(401).json({ message: 'User not found' });
    }
    
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    }
    return res.status(401).json({ message: 'Invalid token' });
  }
});

export const adminOnly = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

export const generateToken = (userId) => {
  return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: JWT_EXPIRE });
};
```

### Frontend - Enhanced AuthContext.jsx

```javascript
import { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Restore session on mount
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const token = localStorage.getItem('token');
        const savedUser = localStorage.getItem('user');

        if (token && savedUser) {
          api.setToken(token);
          
          // Verify token is still valid
          const user = await api.getMe();
          setUser(user);
          localStorage.setItem('user', JSON.stringify(user));
        }
      } catch (error) {
        // Token expired or invalid
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        api.setToken(null);
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  const login = async (email, password) => {
    try {
      setError('');
      const data = await api.login(email, password);
      
      api.setToken(data.token);
      const userData = { ...data, token: undefined };
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', data.token);
      
      return userData;
    } catch (error) {
      const errorMsg = error.message || 'Login failed';
      setError(errorMsg);
      throw error;
    }
  };

  const register = async (body) => {
    try {
      setError('');
      const data = await api.register(body);
      
      api.setToken(data.token);
      const userData = { ...data, token: undefined };
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', data.token);
      
      return userData;
    } catch (error) {
      const errorMsg = error.message || 'Registration failed';
      setError(errorMsg);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setError('');
    api.setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('clinicId');
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
```

---

## 📋 Step 4: Environment Variables

### backend/.env.example
```env
# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dental_clinic

# Server
PORT=3000
NODE_ENV=production

# JWT
JWT_SECRET=super-secret-key-min-32-chars-long

# CORS
CLIENT_URL=https://dentalclinic.vercel.app

# Logging
LOG_LEVEL=info
```

### frontend/.env.example
```env
# API URL
VITE_API_URL=https://your-backend.onrender.com/api
```

---

## 🐛 Step 5: Common Production Errors & Fixes

### Error 1: CORS Error
```
Access to XMLHttpRequest at 'https://api.example.com' has been blocked by CORS policy
```

**Fix:**
```env
# backend/.env
CLIENT_URL=https://your-frontend.vercel.app,https://your-domain.com
```

### Error 2: 401 Unauthorized
```
Error: Invalid token
```

**Causes:**
- Token expired (7 days)
- Wrong JWT_SECRET in backend
- Token not sent in Authorization header

**Fix:**
```javascript
// Refresh or re-login
if (error.status === 401) {
  logout();
  navigate('/login');
}
```

### Error 3: Network timeout
```
Request timeout - Server took too long to respond
```

**Fix:**
- Check if backend is running on Render/Railway
- Verify API_URL is correct
- Increase timeout (api.js: `this.timeout = 30000`)

### Error 4: MONGODB_URI not found
```
MongoServerError: getaddrinfo ENOTFOUND
```

**Fix:**
```bash
# Render/Railway Dashboard → Environment Variables
# Add: MONGODB_URI=mongodb+srv://...
```

---

## 🚀 Step 6: Deployment Steps

### Backend Deployment on Render

1. **Push code to GitHub**
   ```bash
   git add .
   git commit -m "Production ready"
   git push origin main
   ```

2. **Create Render Service**
   - Visit: https://render.com
   - Connect GitHub
   - Create → Web Service
   - Select your repo
   - Runtime: Node
   - Build Command: `npm install`
   - Start Command: `npm start`

3. **Add Environment Variables**
   - Settings → Environment
   - Add all from `.env`:
     - `MONGODB_URI`
     - `JWT_SECRET`
     - `CLIENT_URL`
     - `NODE_ENV=production`

4. **Deploy**
   - Render auto-deploys on GitHub push

### Frontend Deployment on Vercel

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Production ready"
   git push origin main
   ```

2. **Connect Vercel**
   - Visit: https://vercel.com
   - Import Project → Select repo
   - Framework: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`

3. **Add Environment Variables**
   - Settings → Environment Variables
   - Add: `VITE_API_URL=https://your-backend.onrender.com/api`

4. **Deploy**
   - Vercel auto-deploys on GitHub push

---

## ✅ Production Checklist

- [ ] Backend `.env` configured with real values
- [ ] Frontend `.env` with backend API URL
- [ ] JWT_SECRET is strong (min 32 characters)
- [ ] CORS CLIENT_URL includes frontend domain
- [ ] MongoDB URI is correct and accessible
- [ ] Backend deployed on Render/Railway
- [ ] Frontend deployed on Vercel
- [ ] Test login with admin@dental.com
- [ ] Test API calls (check Network tab)
- [ ] Check backend health: https://api.example.com/api/health
- [ ] Verify CORS headers in response
- [ ] Test on actual domain (not localhost)

---

## 📊 Folder Structure for Production

```
dental/
├── backend/
│   ├── .env (production values)
│   ├── .env.example
│   ├── server.js
│   ├── package.json
│   ├── config/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── services/
│   └── utils/
│
├── frontend/
│   ├── .env (vercel: VITE_API_URL)
│   ├── .env.example
│   ├── vite.config.js
│   ├── package.json
│   ├── src/
│   │   ├── api.js
│   │   ├── context/
│   │   ├── pages/
│   │   └── components/
│   └── dist/ (built files - on Vercel)
│
└── .gitignore (includes .env)
```

---

## 🔗 Quick Reference

| Component | Development | Production |
|-----------|-------------|------------|
| Backend | localhost:4000 | your-backend.onrender.com |
| Frontend | localhost:3001 | your-domain.vercel.app |
| API URL | /api or http://localhost:4000/api | https://api.backend.com/api |
| Database | MongoDB local | MongoDB Atlas |
| Auth | JWT in localStorage | JWT + Secure cookies |
| CORS | * | Specific domains |

---

## 💡 Best Practices

1. **Never commit .env files**
   ```bash
   # Add to .gitignore
   .env
   .env.local
   ```

2. **Use strong JWT secret**
   ```bash
   # Generate
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

3. **Always use HTTPS in production**
   - Render: Auto HTTPS
   - Vercel: Auto HTTPS

4. **Monitor error logs**
   - Render: Dashboard → Logs
   - Vercel: Analytics → Logs

5. **Set up monitoring**
   - Sentry for error tracking
   - LogRocket for session replay

---

**Questions? Check:**
- Backend logs on Render/Railway
- Frontend logs in browser console
- Network tab for API requests
- Backend `/api/health` endpoint
