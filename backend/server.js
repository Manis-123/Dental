import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';
import { errorHandler } from './middleware/errorHandler.js';
import { protect, adminOnly } from './middleware/auth.js';
import { attachClinic } from './middleware/clinicScope.js';
import { ensureDefaultClinic } from './utils/ensureDefaultClinic.js';
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

// CORS Configuration for Production
const allowedOrigins = process.env.CLIENT_URL?.split(',').map((u) => u.trim()).filter(Boolean) ?? [];

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests without origin (mobile apps, server-to-server)
    if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      if (NODE_ENV === 'production') {
        console.warn(`CORS blocked request from: ${origin}`);
        callback(new Error('Not allowed by CORS'));
      } else {
        // Allow all in development
        callback(null, true);
      }
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Clinic-Id'],
};

app.use(cors(corsOptions));

// Security Headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Dental Clinic API is running',
    environment: NODE_ENV,
    timestamp: new Date().toISOString()
  });
});

app.use('/api/auth', authRoutes);

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

const adminApi = express.Router();
adminApi.use(protect, adminOnly, attachClinic);
adminApi.use('/users', userRoutes);
adminApi.use('/admin', adminRoutes);

app.use('/api', protectedApi);
app.use('/api', adminApi);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ 
    message: 'Route not found',
    path: req.path,
    method: req.method
  });
});

app.use(errorHandler);

connectDB()
  .then(async () => {
    await ensureDefaultClinic();
    app.listen(PORT, () => {
      console.log(`
✅ Server running on port ${PORT}
📡 Environment: ${NODE_ENV}
🌍 Allowed Origins: ${allowedOrigins.length > 0 ? allowedOrigins.join(', ') : 'Development mode - all origins allowed'}
      `);
    });
  })
  .catch((err) => {
    console.error('❌ Failed to connect to MongoDB:', err.message);
    process.exit(1);
  });
