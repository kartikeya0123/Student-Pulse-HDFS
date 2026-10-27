import {
  Activity,
  Cloud,
  Database,
  Server,
  UserPlus,
  Play,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';

interface Props {
  dataSource: string;
  backendOnline: boolean;
  onOpenAddModal: () => void;
  onRunHadoop: () => void;
  onRefresh: () => void;
  totalStudents: number;
}

export function Header({
  dataSource,
  backendOnline,
  onOpenAddModal,
  onRunHadoop,
  onRefresh,
  totalStudents,
}: Props) {
  return (
    <header className="glass-panel sticky top-0 z-30 px-5 md:px-8 py-3.5 border-b border-white/10 flex items-center justify-between gap-4 flex-wrap">
      {/* Brand */}
      <div className="flex items-center gap-3">
        <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 via-sky-500 to-indigo-600 text-slate-950 font-black shadow-lg shadow-cyan-500/25">
          <Activity size={22} className="animate-pulse" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-heading text-lg font-extrabold tracking-tight text-white">
              StudentPulse
            </h1>
            <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-cyan-500/15 text-cyan-300 border border-cyan-400/30">
              v2.0 Glassmorphic
            </span>
          </div>
          <p className="text-[11px] text-slate-400">
            Big Data Hadoop/HDFS &bull; Supabase Cloud Platform
          </p>
        </div>
      </div>

      {/* Live Cloud & Cluster Telemetry Status Pills */}
      <div className="hidden xl:flex items-center gap-2 text-xs">
        {/* Supabase Status */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <Cloud size={13} />
          <span>Supabase (replaces AWS): <strong>Live</strong></span>
        </div>

        {/* Flask API Status */}
        <div
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border ${
            backendOnline
              ? 'bg-cyan-500/10 border-cyan-500/20 text-cyan-300'
              : 'bg-white/5 border-white/10 text-slate-400'
          }`}
        >
          <Server size={13} />
          <span>Flask REST: <strong>{backendOnline ? 'Online (5000)' : 'Direct Mode'}</strong></span>
        </div>

        {/* Hadoop HDFS */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-300">
          <Database size={13} />
          <span>HDFS: <strong>4 DataNodes</strong></span>
        </div>

        {/* Records Count */}
        <div className="px-2.5 py-1.5 rounded-xl bg-white/5 border border-white/10 text-slate-300 font-mono">
          {totalStudents} records
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2.5 ml-auto sm:ml-0">
        <button
          onClick={onRefresh}
          className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition"
          title="Refresh Data from Supabase"
        >
          <RefreshCw size={15} />
        </button>

        <button
          onClick={onRunHadoop}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-cyan-500/15 border border-white/10 hover:border-cyan-400/30 text-slate-200 hover:text-cyan-300 text-xs font-semibold transition"
        >
          <Play size={13} />
          Run MapReduce
        </button>

        <button
          onClick={onOpenAddModal}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-sky-500 text-slate-950 font-bold text-xs hover:opacity-90 transition shadow-lg shadow-cyan-500/20"
        >
          <UserPlus size={14} />
          Add Student
        </button>
      </div>
    </header>
  );
}
