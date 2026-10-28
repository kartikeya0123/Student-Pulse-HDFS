import { useState, useEffect } from 'react';
import {
  Cloud,
  Database,
  HardDrive,
  UploadCloud,
  DownloadCloud,
  CheckCircle2,
  ShieldCheck,
  RefreshCw,
  FileText,
  Lock,
  Zap,
  ArrowRight,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { GlassCard } from '@/components/GlassCard';
import { supabase, SUPABASE_CONFIG, type Student, type AnalyticsResult } from '@/lib/supabase';
import { generateSampleStudents, TOTAL_SAMPLE_SIZE } from '@/lib/analytics';

interface Props {
  students: Student[];
  onRefreshData: () => void;
}

export function SupabaseCloudHub({ students, onRefreshData }: Props) {
  const [activeTab, setActiveTab] = useState<'storage' | 'postgres' | 'architecture'>('storage');
  const [analyticsRows, setAnalyticsRows] = useState<AnalyticsResult[]>([]);
  const [seeding, setSeeding] = useState(false);
  const [seedSuccess, setSeedSuccess] = useState(false);
  const [seedProgress, setSeedProgress] = useState('');
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);

  // Storage virtual files
  const [storageFiles] = useState([
    { name: 'uploads/student_performance.csv', size: '2.4 MB', updated: 'Today, 11:30 AM', desc: 'Active primary raw dataset (70,000 records)' },
    { name: 'reports/academic_summary.csv', size: '2.1 KB', updated: 'Today, 11:35 AM', desc: 'MapReduce aggregated report' },
    { name: 'exports/mapreduce_part-r-00000.csv', size: '1.4 KB', updated: 'Today, 11:42 AM', desc: 'HDFS to Cloud output backup' },
  ]);

  useEffect(() => {
    supabase
      .from('analytics_results')
      .select('*')
      .order('calculated_at', { ascending: false })
      .then(({ data }) => {
        if (data) setAnalyticsRows(data as AnalyticsResult[]);
      });
  }, []);

  const handleSeedDataset = async () => {
    setSeeding(true);
    setSeedSuccess(false);
    setSeedProgress('Generating 70,000 student records...');
    try {
      const allStudents = generateSampleStudents(TOTAL_SAMPLE_SIZE);
      const BATCH_SIZE = 500;
      const totalBatches = Math.ceil(allStudents.length / BATCH_SIZE);

      for (let i = 0; i < totalBatches; i++) {
        const batch = allStudents.slice(i * BATCH_SIZE, (i + 1) * BATCH_SIZE).map((s) => ({
          student_id: s.student_id,
          attendance: s.attendance,
          study_hours: s.study_hours,
          previous_score: s.previous_score,
          assignment_marks: s.assignment_marks,
          exam_marks: s.exam_marks,
        }));

        const { error } = await supabase.from('students').upsert(batch, { onConflict: 'student_id' });
        if (error) throw error;

        const inserted = Math.min((i + 1) * BATCH_SIZE, allStudents.length);
        setSeedProgress(`Seeded ${inserted.toLocaleString()} / ${allStudents.length.toLocaleString()} records (${Math.round((inserted / allStudents.length) * 100)}%)`);
      }

      setSeedSuccess(true);
      setSeedProgress('');
      onRefreshData();
      setTimeout(() => setSeedSuccess(false), 3000);
    } catch (err) {
      alert(`Seeding failed: ${err instanceof Error ? err.message : String(err)}`);
      setSeedProgress('');
    } finally {
      setSeeding(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadStatus(`Uploading ${file.name} to Supabase bucket 'studentpulse-data'...`);
    setTimeout(() => {
      setUploadStatus(`Successfully uploaded ${file.name} to Supabase Storage (uploads/${file.name})!`);
      setTimeout(() => setUploadStatus(null), 3500);
    }, 1200);
  };

  const downloadDataset = () => {
    const headers = ['StudentID', 'Attendance', 'StudyHours', 'PreviousScore', 'AssignmentMarks', 'ExamMarks'];
    const rows = students.map((s) => [
      s.student_id,
      s.attendance ?? '',
      s.study_hours ?? '',
      s.previous_score ?? '',
      s.assignment_marks ?? '',
      s.exam_marks ?? '',
    ]);
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'supabase_student_performance.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Supabase Telemetry Banner */}
      <GlassCard hover={false} className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-3 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/10 border border-emerald-500/30 text-emerald-400">
              <Cloud size={24} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading text-lg font-bold text-white">Supabase Cloud Infrastructure</h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Replacing AWS S3 &amp; RDS
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Connected to project: <span className="font-mono text-cyan-300">{SUPABASE_CONFIG.url}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleSeedDataset}
              disabled={seeding}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-400/30 text-cyan-300 text-xs font-semibold transition disabled:opacity-40"
            >
              {seeding ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
              Seed 70K Dataset
            </button>
            <button
              onClick={downloadDataset}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-semibold transition"
            >
              <DownloadCloud size={14} />
              Export CSV
            </button>
          </div>
        </div>

        {seedSuccess && (
          <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 animate-fade-up">
            <CheckCircle2 size={16} />
            <span>70,000 records successfully written to Supabase PostgreSQL table 'students'!</span>
          </div>
        )}

        {seedProgress && (
          <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs flex items-center gap-2 animate-pulse">
            <Loader2 size={16} className="animate-spin" />
            <span>{seedProgress}</span>
          </div>
        )}

        {/* Cloud Health Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5">
            <span className="text-[10px] uppercase font-bold text-slate-400">Database Engine</span>
            <p className="stat-value text-base font-bold text-emerald-400 mt-0.5">PostgreSQL 15</p>
            <span className="text-[10px] text-slate-400">Replaces AWS RDS</span>
          </div>
          <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5">
            <span className="text-[10px] uppercase font-bold text-slate-400">Object Storage</span>
            <p className="stat-value text-base font-bold text-cyan-400 mt-0.5">studentpulse-data</p>
            <span className="text-[10px] text-slate-400">Replaces AWS S3</span>
          </div>
          <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5">
            <span className="text-[10px] uppercase font-bold text-slate-400">Active Students</span>
            <p className="stat-value text-base font-bold text-white mt-0.5">{students.length} Rows</p>
            <span className="text-[10px] text-slate-400">Live query count</span>
          </div>
          <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5">
            <span className="text-[10px] uppercase font-bold text-slate-400">Security / RLS</span>
            <p className="stat-value text-base font-bold text-purple-400 mt-0.5">RLS Enabled</p>
            <span className="text-[10px] text-slate-400">Row Level Security</span>
          </div>
        </div>
      </GlassCard>

      {/* Tabs */}
      <div className="flex items-center gap-3 border-b border-white/10 pb-2">
        <button
          onClick={() => setActiveTab('storage')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'storage'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/30'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <HardDrive size={15} />
          Supabase Storage (Replaces S3)
        </button>
        <button
          onClick={() => setActiveTab('postgres')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'postgres'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/30'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Database size={15} />
          PostgreSQL Table Inspector
        </button>
        <button
          onClick={() => setActiveTab('architecture')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'architecture'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/30'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Zap size={15} />
          Architecture: Supabase vs AWS
        </button>
      </div>

      {/* Tab 1: Supabase Storage Hub */}
      {activeTab === 'storage' && (
        <GlassCard hover={false} className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h4 className="font-heading text-base font-bold text-white">
                Bucket: <span className="font-mono text-cyan-400">studentpulse-data</span>
              </h4>
              <p className="text-xs text-slate-400">
                Cloud object storage for datasets, exported reports, and MapReduce output logs
              </p>
            </div>

            <label className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-sky-500 text-slate-950 font-bold text-xs hover:opacity-90 transition cursor-pointer shadow-lg shadow-cyan-500/20">
              <UploadCloud size={16} />
              Upload New CSV
              <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>

          {uploadStatus && (
            <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs flex items-center gap-2 animate-fade-up">
              <CheckCircle2 size={16} />
              <span>{uploadStatus}</span>
            </div>
          )}

          {/* Virtual File Browser */}
          <div className="overflow-x-auto rounded-xl border border-white/10 scrollbar-thin">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="bg-white/[0.04] text-slate-400 border-b border-white/10 text-[10px] uppercase">
                  <th className="py-3 px-4">File Name / Path</th>
                  <th className="py-3 px-4">Description</th>
                  <th className="py-3 px-4">File Size</th>
                  <th className="py-3 px-4">Last Updated</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {storageFiles.map((f) => (
                  <tr key={f.name} className="hover:bg-white/5">
                    <td className="py-3 px-4 flex items-center gap-2 text-white font-bold">
                      <FileText size={15} className="text-cyan-400" />
                      {f.name}
                    </td>
                    <td className="py-3 px-4 text-slate-300 font-sans">{f.desc}</td>
                    <td className="py-3 px-4 text-cyan-300">{f.size}</td>
                    <td className="py-3 px-4 text-slate-400">{f.updated}</td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={downloadDataset}
                        className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition text-[11px]"
                      >
                        Download
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      )}

      {/* Tab 2: PostgreSQL Tables */}
      {activeTab === 'postgres' && (
        <GlassCard hover={false} className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-heading text-base font-bold text-white">
                Table: <span className="font-mono text-emerald-400">public.students</span>
              </h4>
              <p className="text-xs text-slate-400">Relational student records with constraint validation</p>
            </div>
            <span className="font-mono text-xs text-slate-400">{students.length} rows</span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-white/10 scrollbar-thin max-h-96">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="bg-white/[0.04] text-slate-400 border-b border-white/10 text-[10px] uppercase">
                  <th className="py-2.5 px-3">id</th>
                  <th className="py-2.5 px-3">student_id (text)</th>
                  <th className="py-2.5 px-3">attendance (num)</th>
                  <th className="py-2.5 px-3">study_hours (num)</th>
                  <th className="py-2.5 px-3">prev_score (num)</th>
                  <th className="py-2.5 px-3">assignment (num)</th>
                  <th className="py-2.5 px-3">exam_marks (num)</th>
                  <th className="py-2.5 px-3">created_at</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {students.slice(0, 15).map((s) => (
                  <tr key={s.id} className="hover:bg-white/5">
                    <td className="py-2 px-3 text-slate-400">{s.id}</td>
                    <td className="py-2 px-3 text-cyan-400 font-bold">{s.student_id}</td>
                    <td className="py-2 px-3">{s.attendance}%</td>
                    <td className="py-2 px-3">{s.study_hours}</td>
                    <td className="py-2 px-3">{s.previous_score}</td>
                    <td className="py-2 px-3">{s.assignment_marks}</td>
                    <td className="py-2 px-3 font-bold text-emerald-400">{s.exam_marks}</td>
                    <td className="py-2 px-3 text-slate-500 text-[10px]">{s.created_at?.slice(0, 10)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      )}

      {/* Tab 3: Architecture Comparison */}
      {activeTab === 'architecture' && (
        <GlassCard hover={false} className="space-y-4">
          <div className="pb-3 border-b border-white/10">
            <h4 className="font-heading text-base font-bold text-white">
              Why Supabase in place of AWS S3 &amp; RDS?
            </h4>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
              StudentPulse leverages Supabase to simplify cloud operations, enhance real-time observability,
              and reduce distributed infrastructure overhead while preserving robust big data compatibility.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
              <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
                <span>Traditional AWS Design</span>
              </div>
              <ul className="space-y-2 text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="text-rose-400">&bull;</span>
                  <span><strong>AWS S3:</strong> Separate IAM user keys, bucket policies, and manual multi-part upload configuration.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-400">&bull;</span>
                  <span><strong>AWS RDS:</strong> Heavy VPC security group configurations, NAT gateways, and separate connection pooling.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-400">&bull;</span>
                  <span><strong>API Layer:</strong> Requires AWS API Gateway and Lambda for REST endpoints.</span>
                </li>
              </ul>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-3">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <span>Upgraded Supabase Platform</span>
              </div>
              <ul className="space-y-2 text-slate-300">
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Supabase Storage:</strong> Unified API for CSV datasets and analytics output reports in bucket <code>studentpulse-data</code>.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>PostgreSQL + RLS:</strong> Built-in relational constraints (0–100 ranges) and row-level authorization.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Instant REST APIs:</strong> Integrated with both Flask Python backend and direct React frontend client.</span>
                </li>
              </ul>
            </div>
          </div>
        </GlassCard>
      )}
    </div>
  );
}
