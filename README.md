# StudentPulse — Student Performance Analytics Platform & Big Data Engine

A full-stack, glassmorphic analytics platform that monitors and analyzes student academic performance, attendance patterns, and study habits. The system integrates a modern React frontend with a Python Flask REST backend, Supabase PostgreSQL cloud storage, and simulated Big Data Hadoop / MapReduce processing jobs.

---

## 🌟 Key Features

- **Executive Analytics Dashboard**: Real-time KPI summary tracking pass rate, average exam marks, study hours, and academic risk metrics.
- **Exam Distribution & Tier Breakdown**: Visual breakdown of student scores across customizable grade bands (A, B, C, D, F).
- **Attendance & Risk Analysis**: Identifies at-risk students based on attendance thresholds and performance correlation.
- **Study Efficiency Correlation**: Visualizes relationship between study hours, assignment marks, and final exam outcomes.
- **Student Explorer**: Interactive tabular explorer with multi-column sorting, search filters, and individual student profile drawers.
- **Hadoop MapReduce Simulation Hub**: Run simulated distributed MapReduce jobs to compute dataset-wide aggregations and performance statistics.
- **Supabase Cloud Hub**: Seamless cloud database integration with automated health checks, data synchronization, and schema migrations.
- **Data Quality & Audit Panel**: Real-time audit tool reporting missing records, invalid entries, and dataset completeness.

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + Custom Glassmorphic Design System
- **Icons**: [Lucide React](https://lucide.dev/)
- **Cloud Client**: [@supabase/supabase-js](https://supabase.com/docs/reference/javascript)

### Backend & Big Data
- **API Framework**: [Python Flask](https://flask.palletsprojects.com/)
- **CORS**: Flask-CORS
- **Cloud SDK**: Supabase Python Client
- **Big Data Simulation**: Python-based MapReduce engine replicating Hadoop HDFS batch jobs

---

## 🚀 Quick Start Guide

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [Python](https://www.python.org/) (v3.10 or higher)
- [Git](https://git-scm.com/)

---

### 1. Clone the Repository
```bash
git clone https://github.com/kartikeya0123/Student-Pulse-HDFS.git
cd Student-Pulse-HDFS
```

---

### 2. Backend Setup (Flask API — Port 5000)

Open a terminal and navigate to the backend directory:
```bash
cd backend

# Install dependencies
python -m pip install -r requirements.txt

# Start Flask backend server
python start_backend.py
```
> Backend runs at `http://127.0.0.1:5000`  
> Health check endpoint: `http://127.0.0.1:5000/api/health`

---

### 3. Frontend Setup (React + Vite — Port 5173)

Open a second terminal in the project root:
```bash
# Install frontend dependencies
npm install

# Start Vite development server
npm run dev
```
> Frontend application opens at `http://localhost:5173`

---

## 📂 Project Structure

```text
├── backend/
│   ├── app.py                 # Flask REST API endpoints & routes
│   ├── start_backend.py       # Standalone backend server runner
│   ├── supabase_client.py     # Supabase Python SDK connection
│   ├── requirements.txt       # Python dependencies
│   ├── data/                  # Sample student datasets (CSV)
│   └── mapreduce/             # MapReduce mapper/reducer implementation
├── src/
│   ├── components/            # React UI components & glassmorphic panels
│   ├── lib/                   # Supabase client, analytics logic, & data helpers
│   ├── App.tsx                # Main application layout & state
│   ├── index.css              # Design tokens & glassmorphic styles
│   └── main.tsx               # React application entry point
├── supabase/
│   └── migrations/            # SQL migrations and table schemas
├── package.json               # Node.js dependencies and scripts
└── vite.config.ts             # Vite build configuration
```

---

## ⚙️ Environment Configuration

Copy the example environment files and adjust if using custom Supabase credentials:

**Frontend (`.env`)**:
```env
VITE_SUPABASE_URL=https://your-supabase-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

**Backend (`backend/.env`)**:
```env
SUPABASE_URL=https://your-supabase-project.supabase.co
SUPABASE_KEY=your-supabase-anon-key
FLASK_PORT=5000
```

---

## 📄 License
This project is open source and available under the [MIT License](LICENSE).
