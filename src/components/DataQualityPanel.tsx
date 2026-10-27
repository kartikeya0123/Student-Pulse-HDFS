import { ShieldCheck, AlertTriangle, CheckCircle2, RefreshCw, Sparkles, FileCheck } from 'lucide-react';
import { GlassCard } from '@/components/GlassCard';
import type { DataQualityReport } from '@/lib/analytics';

interface Props {
  report: DataQualityReport;
  onCleanDataset?: () => void;
}

export function DataQualityPanel({ report, onCleanDataset }: Props) {
  const totalIssues =
    report.missing_attendance +
    report.missing_exam_marks +
    report.missing_study_hours +
    report.invalid_scores +
    report.duplicate_ids;

  const checks = [
    { label: 'Total Rows Verified', value: report.total_rows, ok: true },
    { label: 'Missing Attendance Values', value: report.missing_attendance, ok: report.missing_attendance === 0 },
    { label: 'Missing Exam Scores', value: report.missing_exam_marks, ok: report.missing_exam_marks === 0 },
    { label: 'Missing Study Hours', value: report.missing_study_hours, ok: report.missing_study_hours === 0 },
    { label: 'Out-of-Range Scores (0–100)', value: report.invalid_scores, ok: report.invalid_scores === 0 },
    { label: 'Duplicate Student IDs', value: report.duplicate_ids, ok: report.duplicate_ids === 0 },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Health Score Gauge Card */}
        <GlassCard hover={false} className="flex flex-col items-center justify-center text-center p-6">
          <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mb-3">
            <ShieldCheck size={28} />
          </div>

          <span className="text-xs uppercase font-bold tracking-wider text-slate-400">
            Dataset Integrity Health Score
          </span>
          <div className="stat-value text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400 mt-2">
            {report.healthScore}%
          </div>

          <p className="text-xs text-slate-400 mt-2 max-w-xs">
            {totalIssues === 0
              ? 'All records satisfy relational constraints and schema validation.'
              : `${totalIssues} data anomaly flagged across the loaded dataset.`}
          </p>

          <div className="mt-4 pt-4 border-t border-white/10 w-full flex items-center justify-between text-xs text-slate-400">
            <span>Validation: Strict</span>
            <span className="text-emerald-400 font-semibold">PostgreSQL Compliant</span>
          </div>
        </GlassCard>

        {/* 6 Validation Checkpoints */}
        <GlassCard hover={false} className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <div className="flex items-center gap-2.5">
              <FileCheck size={18} className="text-cyan-400" />
              <h4 className="font-heading text-base font-bold text-white">Schema Conformance Checklist</h4>
            </div>
            <span className="text-xs text-slate-400 font-mono">
              6 Rules Evaluated
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {checks.map((c) => (
              <div
                key={c.label}
                className="p-3 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  {c.ok ? (
                    <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                  ) : (
                    <AlertTriangle size={16} className="text-amber-400 shrink-0" />
                  )}
                  <span className="text-xs text-slate-300">{c.label}</span>
                </div>
                <span
                  className={`stat-value font-bold text-sm ${
                    c.ok ? 'text-emerald-400' : 'text-amber-400 font-bold'
                  }`}
                >
                  {c.value}
                </span>
              </div>
            ))}
          </div>

          <div className="p-3.5 rounded-xl bg-cyan-950/20 border border-cyan-500/20 text-xs text-slate-300 flex items-center justify-between flex-wrap gap-2">
            <span>Data cleansing automatically handles missing fields during MapReduce aggregation.</span>
            {totalIssues > 0 && onCleanDataset && (
              <button
                onClick={onCleanDataset}
                className="px-3 py-1.5 rounded-lg bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 border border-cyan-400/30 font-semibold transition"
              >
                Auto-Clean Dataset
              </button>
            )}
          </div>
        </GlassCard>
      </div>

      {/* Flagged Issues List */}
      <GlassCard hover={false} className="space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <AlertTriangle size={16} className="text-amber-400" />
            <h4 className="font-heading text-sm font-bold text-white">Detected Dataset Issues Log</h4>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {report.issuesList.length} anomalies
          </span>
        </div>

        {report.issuesList.length === 0 ? (
          <div className="py-8 text-center text-slate-400 text-xs">
            <CheckCircle2 size={24} className="mx-auto text-emerald-400 mb-2" />
            <p>Clean dataset! Zero missing values, zero duplicates, zero out-of-range scores.</p>
          </div>
        ) : (
          <div className="space-y-2 max-h-48 overflow-y-auto scrollbar-thin pr-1">
            {report.issuesList.map((item, i) => (
              <div
                key={i}
                className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-between text-xs"
              >
                <span className="font-mono text-cyan-400 font-semibold">{item.student_id}</span>
                <span className="text-amber-300">{item.reason}</span>
              </div>
            ))}
          </div>
        )}
      </GlassCard>
    </div>
  );
}
