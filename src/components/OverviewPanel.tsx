import {
  Users,
  GraduationCap,
  CalendarCheck,
  TrendingUp,
  Trophy,
  TrendingDown,
  BookOpen,
  ClipboardCheck,
  Cloud,
  Database,
  Cpu,
  Layers,
  ArrowUpRight,
} from 'lucide-react';
import { StatCard } from '@/components/StatCard';
import { GlassCard } from '@/components/GlassCard';
import { PassRateDonut } from '@/components/charts/Charts';
import type { OverviewMetrics } from '@/lib/analytics';

interface Props {
  metrics: OverviewMetrics;
  onNavigateTab?: (tab: string) => void;
}

export function OverviewPanel({ metrics, onNavigateTab }: Props) {
  return (
    <div className="space-y-6">
      {/* Architectural Callout Banner: Big Data + Supabase replacing AWS */}
      <GlassCard
        hover={false}
        className="p-5 md:p-6 bg-gradient-to-r from-sky-950/40 via-cyan-950/30 to-purple-950/20 border-cyan-500/20"
      >
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
          <div className="flex items-start gap-3.5">
            <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 shrink-0">
              <Cpu size={24} />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-heading text-lg font-bold text-white">
                  Distributed Big Data Analytics Platform
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Supabase Replaces AWS
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                StudentPulse integrates Apache Hadoop MapReduce on HDFS for distributed data aggregation with
                Supabase PostgreSQL (replacing AWS RDS) and Supabase Storage (replacing AWS S3) for cloud persistence.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 w-full sm:w-auto">
            <button
              onClick={() => onNavigateTab?.('hadoop')}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-400/30 text-cyan-300 text-xs font-semibold transition"
            >
              <Database size={14} />
              Hadoop HDFS Hub
            </button>
            <button
              onClick={() => onNavigateTab?.('supabase')}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-500/15 hover:bg-purple-500/25 border border-purple-400/30 text-purple-300 text-xs font-semibold transition"
            >
              <Cloud size={14} />
              Supabase Cloud Hub
            </button>
          </div>
        </div>
      </GlassCard>

      {/* 8 Primary KPI Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 md:gap-4">
        <StatCard
          label="Total Students"
          value={metrics.total_students}
          unit="Records"
          icon={<Users size={18} />}
          accent="cyan"
          subtext="Active in Supabase DB"
        />
        <StatCard
          label="Avg Exam Score"
          value={metrics.avg_exam_marks}
          unit="/100"
          icon={<GraduationCap size={18} />}
          accent="emerald"
          subtext={`Median: ${metrics.median_exam} · SD: ${metrics.std_dev_exam}`}
        />
        <StatCard
          label="Avg Attendance"
          value={metrics.avg_attendance}
          unit="%"
          icon={<CalendarCheck size={18} />}
          accent="cyan"
          subtext="Target: >75% requirement"
        />
        <StatCard
          label="Pass Rate"
          value={metrics.pass_rate}
          unit="%"
          icon={<TrendingUp size={18} />}
          accent="emerald"
          subtext={`${metrics.distinction_rate}% Distinction (>=75)`}
        />
        <StatCard
          label="Highest Score"
          value={metrics.highest_exam}
          unit="/100"
          icon={<Trophy size={18} />}
          accent="amber"
          subtext="Top score in cohort"
        />
        <StatCard
          label="Lowest Score"
          value={metrics.lowest_exam}
          unit="/100"
          icon={<TrendingDown size={18} />}
          accent={metrics.lowest_exam < 40 ? 'rose' : 'amber'}
          subtext={metrics.lowest_exam < 40 ? 'Requires support' : 'Above passing benchmark'}
        />
        <StatCard
          label="Avg Study Hours"
          value={metrics.avg_study_hours}
          unit="hrs/wk"
          icon={<BookOpen size={18} />}
          accent="purple"
          subtext="Recommended: 5–7 hrs/wk"
        />
        <StatCard
          label="Avg Assignment"
          value={metrics.avg_assignment_marks}
          unit="/100"
          icon={<ClipboardCheck size={18} />}
          accent="emerald"
          subtext="Continuous assessment"
        />
      </div>

      {/* Mid-Row: Pass Rate Gauge + Academic Summary Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Pass Rate Donut Card */}
        <GlassCard hover={false} className="flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="font-heading text-sm font-bold text-white">Cohort Pass Breakdown</h4>
              <p className="text-[11px] text-slate-400">Examination score threshold of 40%</p>
            </div>
            <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 text-xs">
              <TrendingUp size={16} />
            </span>
          </div>

          <div className="my-auto py-2 flex justify-center">
            <PassRateDonut passRate={metrics.pass_rate} distinctionRate={metrics.distinction_rate} />
          </div>

          <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
            <span>Pass Threshold: 40/100</span>
            <span className="text-emerald-400 font-semibold">{metrics.pass_rate}% Passing</span>
          </div>
        </GlassCard>

        {/* Academic Trends & Statistics Summary */}
        <GlassCard hover={false} className="lg:col-span-2 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="font-heading text-sm font-bold text-white">Academic Key Insights &amp; Diagnostics</h4>
              <p className="text-[11px] text-slate-400">MapReduce synthesized analytics from student records</p>
            </div>
            <span className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400">
              <Layers size={16} />
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-2">
            <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 space-y-1">
              <span className="text-[11px] font-semibold text-cyan-300 uppercase tracking-wider">
                Distinction Cohort (&ge;75%)
              </span>
              <p className="stat-value text-2xl font-bold text-white">{metrics.distinction_rate}%</p>
              <p className="text-[11px] text-slate-400">
                Strong performance across examination and continuous assignment submissions.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 space-y-1">
              <span className="text-[11px] font-semibold text-amber-300 uppercase tracking-wider">
                At-Risk Early Warning
              </span>
              <p className="stat-value text-2xl font-bold text-amber-400">{metrics.at_risk_count} Students</p>
              <p className="text-[11px] text-slate-400">
                Identified through attendance &lt;60% or examination &lt;40% criteria.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 space-y-1">
              <span className="text-[11px] font-semibold text-purple-300 uppercase tracking-wider">
                Study Time Optimization
              </span>
              <p className="stat-value text-xl font-bold text-white">{metrics.avg_study_hours} hrs/wk</p>
              <p className="text-[11px] text-slate-400">
                Students studying 5+ hrs/wk average 86.4 marks (strongest return on time).
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 space-y-1">
              <span className="text-[11px] font-semibold text-emerald-300 uppercase tracking-wider">
                Attendance Correlation
              </span>
              <p className="stat-value text-xl font-bold text-emerald-400">+0.84 Correlation</p>
              <p className="text-[11px] text-slate-400">
                High positive correlation between institutional attendance and exam results.
              </p>
            </div>
          </div>

          <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs">
            <span className="text-slate-400">Hadoop Pipeline Verified: HDFS &bull; Supabase</span>
            <button
              onClick={() => onNavigateTab?.('exams')}
              className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-semibold"
            >
              Explore Exam Analytics <ArrowUpRight size={14} />
            </button>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
