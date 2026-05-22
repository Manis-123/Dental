# DentalCare Clinic — MERN Project

Dental clinic management system built with **React.js**, **Node.js**, **Express**, and **MongoDB**.

## Features

- **Login / Auth** — JWT-based secure login (admin & staff)
- **Admin Panel** — admin-only dashboard: users, revenue, clinic overview
- **Dashboard** — patients, doctors, appointments, bills & revenue overview
- **Patients** — register and manage patient records
- **Doctors** — add dental specialists
- **Treatments** — services with price (PKR) and category
- **Appointments** — book, complete, or cancel visits
- **Patient Bills** — create bills, multiple items, discount, partial/full payment

## Project Structure

```
dental/
├── backend/     # Node.js + Express + MongoDB API
└── frontend/    # React (Vite) UI
```

## Requirements

- [Node.js](https://nodejs.org/) (v18+)
- [MongoDB](https://www.mongodb.com/) running locally or MongoDB Atlas

## Setup

### 1. MongoDB

Start MongoDB locally (default: `mongodb://127.0.0.1:27017`) or use Atlas and copy your connection string.

### 2. Backend

```bash
cd backend
npm install
copy .env.example .env
```

Edit `.env` if needed:

```
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/dental_clinic
JWT_SECRET=your_secret_key_change_in_production
```

Optional — load sample data:

```bash
node seed.js
```

Start API:

```bash
npm run dev
```

Server: http://localhost:5000

### 3. Frontend

New terminal:

```bash
cd frontend
npm install
npm run dev
```

App: http://localhost:3000 (login required)

### Demo Login (after seed)

| Role  | Email              | Password  |
|-------|--------------------|-----------|
| Admin | admin@dental.com   | admin123  |
| Staff | staff@dental.com   | staff123  |

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check (public) |
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/register` | Register user |
| GET | `/api/auth/me` | Current user (auth required) |
| GET | `/api/stats` | Dashboard stats |
| CRUD | `/api/patients` | Patients |
| CRUD | `/api/doctors` | Doctors |
| CRUD | `/api/treatments` | Treatments |
| CRUD | `/api/appointments` | Appointments |
| CRUD | `/api/bills` | Patient bills & payments |
| GET | `/api/admin/overview` | Admin stats (admin only) |
| CRUD | `/api/users` | Manage staff/admin users (admin only) |

> All routes except `/api/health` and `/api/auth/login` require `Authorization: Bearer <token>` header.  
> Admin routes (`/api/admin/*`, `/api/users`) require `role: admin`.

## Tech Stack

- **Frontend:** React 18, React Router, Vite
- **Backend:** Node.js, Express, Mongoose, JWT, bcrypt
- **Database:** MongoDB

## Production Deployment

### Environment variables

**Backend** (`backend/.env` on Render/Railway):

| Variable | Example | Required |
|----------|---------|----------|
| `MONGODB_URI` | Atlas connection string | Yes |
| `JWT_SECRET` | Long random string | Yes |
| `CLIENT_URL` | `https://your-app.vercel.app` | Yes (production) |
| `PORT` | Set by host (Render/Railway) | Auto |

**Frontend** (Vercel / Netlify dashboard):

| Variable | Example | Required |
|----------|---------|----------|
| `VITE_API_URL` | `https://dental-api.onrender.com/api` | Yes (production) |

> Local dev: `VITE_API_URL` khali rakho — `/api` proxy se chalega.

### MongoDB Atlas

1. **Network Access** → Add IP `0.0.0.0/0` (Allow from anywhere) for cloud hosting
2. Database user password `.env` mein set karo

### Step 1 — Backend (Render)

1. [render.com](https://render.com) → New **Web Service** → connect repo
2. **Root Directory:** `backend`
3. **Build:** `npm install` | **Start:** `npm start`
4. Environment variables add karo (`MONGODB_URI`, `JWT_SECRET`, `CLIENT_URL`)
5. Deploy ke baad URL copy karo, e.g. `https://dental-clinic-api.onrender.com`
6. Health check: `https://YOUR-API.onrender.com/api/health`

Optional: repo mein `backend/render.yaml` Blueprint ke liye use kar sakte ho.

### Step 2 — Frontend (Vercel)

1. [vercel.com](https://vercel.com) → Import repo
2. **Root Directory:** `frontend`
3. **Framework:** Vite
4. Environment: `VITE_API_URL` = `https://YOUR-API.onrender.com/api`
5. Deploy

Netlify: `frontend/netlify.toml` already configured — `VITE_API_URL` same set karo.

### Step 3 — Link backend ↔ frontend

Backend par `CLIENT_URL` = apna Vercel/Netlify URL (exact, no trailing slash):

```
CLIENT_URL=https://your-app.vercel.app
```

Phir backend **redeploy** karo.

### Step 4 — Admin user (production DB)

Render shell ya local se (Atlas URI ke sath):

```bash
cd backend
npm run create-admin
```

Login: `admin@dental.com` / `admin123` — production mein password change karein.

### Deploy checklist

- [ ] `.env` files Git par commit **nahi** kiye
- [ ] `JWT_SECRET` strong random string
- [ ] `VITE_API_URL` ends with `/api`
- [ ] `CLIENT_URL` = exact frontend URL
- [ ] Atlas IP whitelist open for cloud
- [ ] Admin password changed after first login
