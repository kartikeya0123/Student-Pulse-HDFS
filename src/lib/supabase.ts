import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://vmbxjvnyqwscgnzbsyff.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZtYnhqdm55cXdzY2duemJzeWZmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMwOTY3ODAsImV4cCI6MjEwODY3Mjc4MH0.r2F-eSgS5HQ69g-W-qcxNdr87myl_nXMUXkBaNMBtKg';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { persistSession: false },
});

export const SUPABASE_CONFIG = {
  url: supabaseUrl,
  anonKey: supabaseAnonKey,
  bucket: 'studentpulse-data',
  tables: ['students', 'analytics_results'],
};

export const FLASK_API_BASE = 'http://127.0.0.1:5000/api';

export interface Student {
  id: number;
  student_id: string;
  attendance: number | null;
  study_hours: number | null;
  previous_score: number | null;
  assignment_marks: number | null;
  exam_marks: number | null;
  created_at: string;
}

export interface AnalyticsResult {
  id: number;
  metric_name: string;
  metric_value: number | null;
  dataset_version: string | null;
  calculated_at: string;
}

export interface StorageFile {
  name: string;
  size: string;
  updated_at: string;
  type: string;
}

export interface BackendHealth {
  status: string;
  service: string;
  version: string;
  cloud_provider: string;
  supabase_connection: string;
  hadoop_engine: string;
  timestamp: string;
}
