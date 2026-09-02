# ⚡ NEET Track 2027

A family study, attendance, syllabus tracking, and performance companion built for **Akarsh Singh** for NEET 2027 preparation.

---

## 🌟 Key Features

* **📚 NCERT Master Checklist**: 79+ Class 11 & 12 chapters with attached notes and formula traps.
* **🏛️ AIIMS & MP GMC Rank Predictor**: Dynamic rank & score projections for UR category across 15 AIIMS and 15 MP GMCs (85% State Quota).
* **🔥 Study Heatmap**: Month-wise LeetCode-style activity grid with milestone badges ($\ge 3$ hours) and Indian Standard Time (IST) tracking.
* **⏱️ Daily Log & Curfew**: Live study timer, break tracking, and automated 10:00 PM IST sleep curfew.
* **👨‍👩‍👦 Family Encouragement Wall**: Note system with dedicated author badges (Papa, Mummy, Brother, Akarsh).
* **🛡️ Data Vault**: 1-click JSON backup & restore to prevent any data loss across devices.

---

## 🏗️ Tech Stack

* **Frontend**: React 18, Vite, TypeScript, Tailwind CSS, Lucide Icons, Recharts, Framer Motion
* **Backend**: NestJS 10, TypeScript, Express Serverless Adapter, Swagger OpenAPI Docs
* **Database**: PostgreSQL on **Neon** (`ep-bitter-wave-ayo258p8`) with Prisma ORM
* **Timezone**: Indian Standard Time (IST / `Asia/Kolkata`)

---

## 🚀 Deployment

### Frontend (Vercel)
* **Root Directory**: `frontend`
* **Build Command**: `npm run build`
* **Output Directory**: `dist`
* **Environment Variable**: `VITE_API_URL` = your live backend URL

### Backend (Vercel Serverless / Render)
* **Root Directory**: `backend`
* **Build Command**: `prisma generate && nest build`
* **Environment Variables**:
  * `DATABASE_URL`: Neon connection string
  * `DIRECT_URL`: Neon direct connection string
  * `TZ`: `Asia/Kolkata`
