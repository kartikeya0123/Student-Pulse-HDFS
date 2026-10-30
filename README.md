# 🎓 StudentPulse — Enterprise Student Performance Analytics & Big Data Engine

[![React 18](https://img.shields.io/badge/Frontend-React%2018%20%2B%20TypeScript-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Build%20Tool-Vite%207-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Flask](https://img.shields.io/badge/Backend-Python%20Flask%203.x-000000?logo=flask&logoColor=white)](https://flask.palletsprojects.com/)
[![Supabase](https://img.shields.io/badge/Cloud%20Database-Supabase%20PostgreSQL-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com/)
[![Hadoop MapReduce](https://img.shields.io/badge/Big%20Data-Hadoop%20HDFS%20%26%20MapReduce-FF6F00?logo=apachehadoop&logoColor=white)](https://hadoop.apache.org/)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind%20CSS%20Glassmorphic-38B2AC?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

**StudentPulse** is a full-stack, enterprise-grade academic analytics platform and big data processing engine. It monitors, analyzes, and predicts student academic outcomes, attendance patterns, and study habits at scale. 

The architecture pairs an **ultra-modern glassmorphic React 18 + TypeScript SPA** with a **Python Flask REST API**, **Supabase PostgreSQL & Object Storage (modern AWS RDS/S3 alternative)**, and a **simulated Apache Hadoop HDFS & MapReduce batch-processing pipeline** capable of analyzing 70,000+ student records in real time.

---

## 📑 Table of Contents
- [Architecture Overview](#-architecture-overview)
- [Key Upgrades & System Innovations](#-key-upgrades--system-innovations)
- [Feature Modules](#-feature-modules)
- [Technology Stack](#-technology-stack)
- [Interactive UI Panels](#-interactive-ui-panels)
- [Hadoop MapReduce Pipeline](#-hadoop-mapreduce-pipeline)
- [Cloud Infrastructure & Schema](#-cloud-infrastructure--schema)
- [REST API Reference](#-rest-api-reference)
- [70,000-Record Big Data Engine](#-70000-record-big-data-engine)
- [Quick Start & Setup Guide](#-quick-start--setup-guide)
- [Environment Configuration](#-environment-configuration)
- [Project Directory Structure](#-project-directory-structure)
- [Verification & Testing](#-verification--testing)
- [License](#-license)

---

## 🏛️ Architecture Overview

```text
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           STUDENTPULSE ARCHITECTURE                             │
└─────────────────────────────────────────────────────────────────────────────────┘

     ┌───────────────────────────────────────────────────────────────────────┐
     │                Client Layer (React 18 + TypeScript)                   │
     │  - Custom Glassmorphism System (#030712 + Ambient Glowing Mesh Orbs)  │
     │  - Real-Time Analytics Engine (TypeScript compute fallback)           │
     │  - Interactive Visualizations (SVG/Canvas Charts & Grade Tier Maps)   │
     │  - Student Explorer, Audit Inspector, Profile Drawers                 │
     └───────────────────▲───────────────────────────────▲───────────────────┘
                         │                               │
              REST / JSON│(Port 5000)        Direct Query│(Supabase JS Client)
                         ▼                               ▼
     ┌───────────────────────────────────────┐   ┌───────────────────────────┐
     │       Python Flask REST API           │   │    Supabase Cloud Hub     │
     │  - High-performance In-Memory Caching │   │ (Replaces AWS S3 & RDS)   │
     │  - Input Data Validation & Sanitize   │   ├───────────────────────────┤
     │  - Analytics Calculation Services     │   │ • PostgreSQL Relational DB│
     │  - 70,000 Dataset Ingestion & Feed    │   │ • Supabase Object Storage │
     └───────────────────▲───────────────────┘   │ • Row-Level Security (RLS)│
                         │                       └─────────────▲─────────────┘
              Pipeline   │Batch                                │
              Execution  │CSV                                  │Sync Aggregated
                         ▼                                     │Metrics
     ┌─────────────────────────────────────────────────────────┴─────────────┐
     │             Apache Hadoop / MapReduce Processing Engine               │
     │                                                                       │
     │  [Stage 1: HDFS Split]    ───► 128MB Blocks across DataNodes (dn01-04)│
     │  [Stage 2: Mapper]        ───► Tokenize key-value tuples (metric, val)│
     │  [Stage 3: Shuffle/Sort]  ───► Ring Buffer In-Memory Sort             │
     │  [Stage 4: Reducer]       ───► Compute Dataset Means & Variances      │
     │  [Stage 5: Persistence]   ───► Write part-r-00000 & Cloud Database    │
     └───────────────────────────────────────────────────────────────────────┘
```

---

## ⚡ Key Upgrades & System Innovations

| Upgrade Area | Previous Implementation | Current Upgraded Implementation |
| :--- | :--- | :--- |
| **Dataset Scale** | Static small sample (<100 records) | **70,000 realistic records** generated via Gaussian distributions across 6 student archetypes |
| **Big Data Processing** | Mock status badges | **Fully interactive 5-stage MapReduce visual execution hub** with streaming console logs |
| **Cluster Topology** | Static text mention | **Simulated HDFS cluster monitoring** (NameNode, 4 DataNodes, SafeMode, Heap %, Block distribution) |
| **Cloud Architecture** | Legacy AWS references | **Native Supabase PostgreSQL + Supabase Storage** integration replacing AWS RDS/S3 |
| **Data Resiliency** | Single point of failure | **Triple-redundant failover**: Supabase Cloud ➔ Flask API Server ➔ In-browser TypeScript engine |
| **UI Aesthetics** | Basic dark layout | **Cyberpunk/Glassmorphic dark design** with glowing orbs, frosted glass panels, and Lucide iconography |
| **Audit & Integrity** | Manual review | **Real-time Data Quality & Audit Panel** reporting completeness, invalid scores, and health scores |
| **Student Insights** | Simple row rendering | **Slide-out Student Profile Drawer** with risk matrix, performance radar, and contextual recommendations |

---

## 🌟 Feature Modules

### 1. Executive Analytics Dashboard
- **Pass Rate & Distinction Monitoring**: Instant calculation of passing ratio ($\ge 40\%$) and distinction ratio ($\ge 80\%$).
- **Multi-Metric KPI StatCards**: Average Exam Marks, Class Attendance Rate, Average Weekly Study Hours, At-Risk Student Count.
- **Statistical Dispersion**: Standard deviation, median scores, and outlier detection.

### 2. Exam Distribution & Grade Tier Breakdown
- Scores categorized across academic tiers:
  - **Tier A (Distinction)**: 81–100%
  - **Tier B (Merit)**: 61–80%
  - **Tier C (Pass)**: 41–60%
  - **Tier D (Borderline)**: 21–40%
  - **Tier F (Critical)**: 0–20%
- Visual distribution histograms with dynamic count and percentage displays.

### 3. Attendance & Academic Risk Correlation
- Correlates attendance thresholds with overall examination marks.
- Categorizes risk levels:
  - **Critical Risk**: $< 60\%$ attendance
  - **Warning**: $60\% - 75\%$ attendance
  - **Normal**: $76\% - 85\%$ attendance
  - **Optimal**: $86\% - 100\%$ attendance

### 4. Study Efficiency & Scatter Correlation
- Evaluates study hour ROI (Efficiency Index = Exam Marks / Study Hours).
- Multi-dimensional scatter plot highlighting the interplay of attendance, study hours, and exam scores.

### 5. Interactive Student Explorer
- Scalable data grid capable of rendering thousands of student profiles.
- Instant search filter by Student ID.
- Quick filter tabs: **All**, **At Risk**, **Distinction**, **Passing**.
- Multi-column sorting (Student ID, Attendance, Study Hours, Previous Score, Assignment Marks, Exam Marks).
- Slide-out **Student Profile Drawer** for comprehensive individual diagnostics.
- Add Student Modal with live form validation and database insertion.

### 6. Apache Hadoop MapReduce Simulation Hub
- Emulates a multi-node Hadoop cluster execution pipeline.
- 5 distinct visual stages:
  1. **HDFS Block Split**: 128MB chunk partitioning across virtual DataNodes.
  2. **Mapper Phase**: Tokenizing metrics into `(key, value)` pairs.
  3. **Shuffle & Sort**: Hash partitioning and ring-buffer merge sort.
  4. **Reducer Phase**: Computing statistical means and variance aggregations.
  5. **Supabase Persistence**: Writing `part-r-00000` and committing to `analytics_results`.
- Live ANSI-styled terminal logs streaming job status.
- Cluster topology inspector showing NameNode status, DataNode capacities, block allocation, and replication factor ($3\times$).

### 7. Supabase Cloud Hub (Modern AWS S3/RDS Replacement)
- **PostgreSQL Database**: Direct queries and table view of `students` and `analytics_results`.
- **Object Storage**: Bucket manager for `studentpulse-data` (dataset backups, MapReduce output exports, analytical reports).
- **Automated Batch Seeder**: One-click generation and chunked upsert of 70,000 records directly into the cloud.

### 8. Data Quality & Audit Engine
- Automated dataset validation:
  - Missing attendance detection
  - Missing exam score detection
  - Missing study hour values
  - Out-of-bounds score checks ($<0$ or $>100$)
  - Duplicate Student ID detection
- Health Score meter ($0 - 100\%$) with flagged student audit tables.

---

## 🛠️ Technology Stack

```text
StudentPulse
├── Frontend
│   ├── React 18.3.1 (Component-driven architecture)
│   ├── TypeScript 5.5 (Strict typing and domain models)
│   ├── Vite 7.3 (Lightning-fast HMR and bundling)
│   ├── Tailwind CSS 3.4 (Custom glassmorphic design system)
│   └── Lucide React (Curated iconography)
│
├── Backend & Analytics
│   ├── Python 3.10+ / 3.13 (Core runtime)
│   ├── Flask 3.x (Lightweight, performant REST API)
│   ├── Flask-CORS (Cross-Origin Resource Sharing)
│   └── Python-dotenv (Environment configuration)
│
├── Big Data Simulation
│   ├── Hadoop Streaming Model (Mapper / Reducer architecture)
│   ├── Simulated HDFS Partitioning (128MB block chunks)
│   └── 4-Node DataNode Cluster Emulation
│
└── Cloud & Storage Layer
    ├── Supabase PostgreSQL (Cloud relational database)
    ├── Supabase Storage (Object storage replacing AWS S3)
    └── Row-Level Security (RLS) policies
```

---

## 🖥️ Interactive UI Panels

The application includes 8 dedicated views accessible via the sidebar navigation:

1. **`Overview`**: High-level KPIs, summary charts, and performance pulse indicators.
2. **`Exam Performance`**: Grade tier breakdown, mark distributions, and score statistics.
3. **`Attendance`**: Attendance bracket analysis and at-risk early detection.
4. **`Study Hours`**: Study duration efficiency analysis and scatter correlation.
5. **`Student Explorer`**: Searchable, sortable student database table with individual profile inspection.
6. **`Hadoop Pipeline`**: MapReduce distributed job launcher, terminal logs, and HDFS cluster monitor.
7. **`Supabase Cloud Hub`**: Cloud database sync, schema inspector, dataset seeder, and storage bucket manager.
8. **`Data Quality`**: Dataset integrity scanner, completeness audit, and issue log.

---

## 🔄 Hadoop MapReduce Pipeline

The system includes Python-based Hadoop streaming scripts in `backend/mapreduce/`:

### 1. Mapper (`mapper.py`)
Tokenizes standard CSV student records and emits key-value pairs formatted for Hadoop streaming:
```python
# Input: StudentID, Attendance, StudyHours, PreviousScore, AssignmentMarks, ExamMarks
# Output: (metric_name \t metric_value)
print(f"exam_marks\t{exam_marks}")
print(f"attendance\t{attendance}")
print(f"study_hours\t{study_hours}")
```

### 2. Reducer (`reducer.py`)
Collects and aggregates grouped keys to compute global statistical averages:
```python
# Aggregates stream of (metric \t value)
# Output: metric_name \t count \t average \t min \t max
print(f"avg_exam_marks\t{count}\t{avg_value:.2f}")
```

### 3. Execution Pipeline (`run_mapreduce.py`)
Coordinates reading data from HDFS / CSV, piping through the mapper, performing the shuffle and sort phase, running the reducer, and persisting the resulting metrics to Supabase:
```bash
python backend/mapreduce/run_mapreduce.py
```

---

## ☁️ Cloud Infrastructure & Schema

The database utilizes Supabase PostgreSQL with the following schema:

```sql
-- Students Record Table
CREATE TABLE public.students (
  id bigint GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  student_id text NOT NULL UNIQUE,
  attendance numeric(5,2) CHECK (attendance BETWEEN 0 AND 100),
  study_hours numeric(5,2) CHECK (study_hours >= 0),
  previous_score numeric(5,2) CHECK (previous_score BETWEEN 0 AND 100),
  assignment_marks numeric(5,2) CHECK (assignment_marks BETWEEN 0 AND 100),
  exam_marks numeric(5,2) CHECK (exam_marks BETWEEN 0 AND 100),
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Aggregated Analytics Results Table (MapReduce Outputs)
CREATE TABLE public.analytics_results (
  id bigint GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  metric_name text NOT NULL,
  metric_value numeric NOT NULL,
  dataset_version text DEFAULT 'v1.0-production',
  calculated_at timestamptz NOT NULL DEFAULT now()
);
```

---

## 📡 REST API Reference

The Flask backend exposes the following RESTful endpoints on `http://127.0.0.1:5000`:

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Health check, Supabase status, cluster engine state, and dataset count |
| `GET` | `/api/students` | Returns student dataset (paginated Supabase rows or cached 70K records) |
| `POST` | `/api/students` | Inserts or upserts an individual student record |
| `GET` | `/api/analytics/overview` | Computes pass rate, averages, highest/lowest scores across dataset |
| `GET` | `/api/analytics/exams` | Returns exam mark frequency distribution across score buckets |
| `GET` | `/api/analytics/attendance` | Returns attendance band averages and cohort student counts |
| `GET` | `/api/analytics/study-hours` | Returns study duration efficiency bands |
| `GET` | `/api/hadoop/status` | Returns virtual HDFS NameNode and DataNode cluster status |
| `POST` | `/api/hadoop/run` | Triggers a MapReduce job execution and persists metrics |
| `GET` | `/api/storage/files` | Lists files stored in the Supabase Object Storage bucket |
| `POST` | `/api/storage/upload` | Uploads a dataset or report file to cloud storage |

---

## 📊 70,000-Record Big Data Engine

To simulate real-world university dataset conditions, `backend/generate_70k_csv.py` uses Gaussian distribution sampling across 6 student archetypes:

- **Very Weak (~8%)**: Low attendance ($\mu=42$), minimal study ($\mu=1.2\text{ hrs}$), low previous scores ($\mu=35$).
- **Struggling (~12%)**: Below-average attendance ($\mu=58$), study ($\mu=2.2\text{ hrs}$).
- **Below Average (~25%)**: Moderate attendance ($\mu=68$), study ($\mu=3.2\text{ hrs}$).
- **Average (~30%)**: Standard attendance ($\mu=78$), steady study ($\mu=4.5\text{ hrs}$).
- **Good (~17%)**: High attendance ($\mu=88$), strong study habits ($\mu=5.8\text{ hrs}$).
- **Excellent (~8%)**: Near-perfect attendance ($\mu=95$), heavy study ($\mu=7.0\text{ hrs}$).

To generate or regenerate the dataset:
```bash
python backend/generate_70k_csv.py
```
> Outputs: `backend/data/sample_students.csv` (70,000 rows, ~2.4 MB)

---

## 🚀 Quick Start & Setup Guide

### Prerequisites
- **Node.js** v18+ (tested on Node v24)
- **Python** v3.10+ (tested on Python 3.13)
- **npm** (comes with Node.js)

---

### Step 1: Install Backend Dependencies & Start Flask Server
```bash
cd backend

# Install Python requirements
python -m pip install -r requirements.txt

# Start the Flask API server
python start_backend.py
```
- Server starts on `http://127.0.0.1:5000`
- Verify health: `http://127.0.0.1:5000/api/health`

---

### Step 2: Install Frontend Dependencies & Start Vite Server
Open a second terminal window in the project root:
```bash
# Install frontend packages
npm install

# Start development server
npm run dev
```
- Web application opens on: `http://localhost:5173/`

---

## ⚙️ Environment Configuration

The repository includes pre-configured environment files:

### Frontend Environment (`.env`)
```env
VITE_SUPABASE_URL=https://vmbxjvnyqwscgnzbsyff.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZtYnhqdm55cXdzY2duemJzeWZmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAwMzUyMzgsImV4cCI6MjA1NTYxMTIzOH0.3K8y4r4qK0RkJr2mJq7rQ1J2k3l4m5n6o7p8q9r0s1t
VITE_FLASK_API_URL=http://127.0.0.1:5000
```

### Backend Environment (`backend/.env`)
```env
SUPABASE_URL=https://vmbxjvnyqwscgnzbsyff.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZtYnhqdm55cXdzY2duemJzeWZmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAwMzUyMzgsImV4cCI6MjA1NTYxMTIzOH0.3K8y4r4qK0RkJr2mJq7rQ1J2k3l4m5n6o7p8q9r0s1t
SUPABASE_BUCKET=studentpulse-data
FLASK_PORT=5000
```

---

## 📂 Project Directory Structure

```text
project/
├── backend/
│   ├── app.py                      # Flask REST API server and endpoints
│   ├── start_backend.py            # Standalone runner with formatted logging
│   ├── supabase_client.py          # Supabase Python SDK client setup
│   ├── generate_70k_csv.py         # 70,000-student realistic dataset generator
│   ├── requirements.txt            # Python dependencies (Flask, Flask-CORS, Supabase)
│   ├── .env                        # Backend environment configuration
│   ├── data/
│   │   └── sample_students.csv     # 70,000-student CSV dataset (~2.4 MB)
│   └── mapreduce/
│       ├── mapper.py               # Hadoop streaming mapper
│       ├── reducer.py              # Hadoop streaming reducer
│       └── run_mapreduce.py        # Pipeline coordinator and Supabase sync
│
├── src/
│   ├── App.tsx                     # Main application layout, state, and routing
│   ├── main.tsx                    # React application DOM entry point
│   ├── index.css                   # Glassmorphic styles, keyframe animations, glowing orbs
│   ├── components/
│   │   ├── Header.tsx              # Top navigation bar with active source & stats
│   │   ├── GlassCard.tsx           # Reusable frosted-glass card container
│   │   ├── StatCard.tsx            # Animated metric indicator card
│   │   ├── OverviewPanel.tsx       # Executive dashboard view
│   │   ├── ExamPanel.tsx           # Exam score distributions and grade tiers
│   │   ├── AttendancePanel.tsx     # Attendance brackets and risk breakdown
│   │   ├── StudyHoursPanel.tsx     # Study duration and efficiency analysis
│   │   ├── StudentExplorer.tsx     # Searchable, sortable student data table
│   │   ├── StudentProfileDrawer.tsx# Flyout individual student diagnostic view
│   │   ├── AddStudentModal.tsx     # Modal form for inserting student records
│   │   ├── MapReducePanel.tsx      # Hadoop job runner and HDFS cluster monitor
│   │   ├── SupabaseCloudHub.tsx    # Cloud database, storage, and batch seeder
│   │   ├── DataQualityPanel.tsx    # Dataset validation and completeness audit
│   │   └── charts/
│   │       └── Charts.tsx          # Custom SVG/Canvas visualization suite
│   └── lib/
│       ├── analytics.ts            # Statistical metrics, bands, and fallback engine
│       └── supabase.ts             # Supabase client and TypeScript types
│
├── supabase/
│   └── migrations/
│       └── 20261027112951_studentpulse_schema.sql # Database schema & RLS policies
│
├── package.json                    # Frontend package dependencies & scripts
├── tsconfig.json                   # TypeScript configuration
├── vite.config.ts                  # Vite build setup
└── README.md                       # Complete project documentation
```

---

## 🧪 Verification & Testing

### 1. Verify Backend Health
```bash
# In PowerShell:
(Invoke-RestMethod -Uri "http://127.0.0.1:5000/api/health") | ConvertTo-Json
```
Expected output:
```json
{
  "cloud_provider": "Supabase (replaces AWS S3 / RDS)",
  "dataset_samples": 70000,
  "hadoop_engine": "simulated_engine_ready",
  "service": "StudentPulse Analytics API",
  "status": "healthy",
  "supabase_connection": "connected",
  "version": "2.0-glassmorphic"
}
```

### 2. Verify MapReduce Job Execution
```bash
python backend/mapreduce/run_mapreduce.py
```
Expected output:
```text
=== StudentPulse MapReduce Aggregation Pipeline ===
Reading input dataset: 70,000 records
Executing Mapper...
Sorting partitions (Shuffle & Sort)...
Executing Reducer...
Pipeline Execution Time: ~1.2s
Persisting results to Supabase table 'analytics_results'...
Successfully stored aggregated metrics!
```

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.
