import { BarChart3, Trophy, Medal, Award, TrendingUp } from 'lucide-react';
import { GlassCard } from '@/components/GlassCard';
import { BellCurveChart } from '@/components/charts/Charts';
import type { ExamDistribution, OverviewMetrics } from '@/lib/analytics';
import type { Student } from '@/lib/supabase';

interface Props {
  distribution: ExamDistribution;
  metrics: OverviewMetrics;
  students: Student[];
  onSelectStudent?: (student: Student) => void;
}

export function ExamPanel({ distribution, metrics, students, onSelectStudent }: Props) {
  // Top 5 Scorers
  const topScorers = [...students]
    .filter((s) => s.exam_marks != null)
    .sort((a, b) => (b.exam_marks ?? 0) - (a.exam_marks ?? 0))
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Top Banner Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <div className="glass-card rounded-2xl p-4 border border-cyan-500/20">
          <span className="text-[11px] font-semibold text-slate-400 uppercase">Average Exam</span>
          <p className="stat-value text-2xl font-bold text-cyan-400 mt-1">{metrics.avg_exam_marks}/100</p>
          <span className="text-[10px] text-slate-400">Class benchmark</span>
        </div>
        <div className="glass-card rounded-2xl p-4 border border-emerald-500/20">
          <span className="text-[11px] font-semibold text-slate-400 uppercase">Pass Rate</span>
          <p className="stat-value text-2xl font-bold text-emerald-400 mt-1">{metrics.pass_rate}%</p>
          <span className="text-[10px] text-slate-400">&ge;40/100 threshold</span>
        </div>
        <div className="glass-card rounded-2xl p-4 border border-purple-500/20">
          <span className="text-[11px] font-semibold text-slate-400 uppercase">Median Score</span>
          <p className="stat-value text-2xl font-bold text-purple-400 mt-1">{metrics.median_exam}/100</p>
          <span className="text-[10px] text-slate-400">50th percentile</span>
        </div>
        <div className="glass-card rounded-2xl p-4 border border-amber-500/20">
          <span className="text-[11px] font-semibold text-slate-400 uppercase">Std. Deviation</span>
          <p className="stat-value text-2xl font-bold text-amber-400 mt-1">&plusmn;{metrics.std_dev_exam}</p>
          <span className="text-[10px] text-slate-400">Score spread index</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Interactive Distribution Histogram & Bell Curve */}
        <GlassCard hover={false} className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                <BarChart3 size={18} />
              </div>
              <div>
                <h3 className="font-heading text-base font-bold text-white">
                  Score Distribution &amp; Bell Curve
                </h3>
                <p className="text-xs text-slate-400">
                  Student distribution across standardized examination performance brackets
                </p>
              </div>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-slate-300 font-mono">
              Total: {metrics.total_students}
            </span>
          </div>

          <div className="py-2">
            <BellCurveChart
              buckets={distribution.buckets}
              totalStudents={metrics.total_students}
            />
          </div>

          {/* Grade Tiers Progress Bars */}
          <div className="mt-6 pt-5 border-t border-white/10">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-3">
              Grade Tier Classification
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {distribution.gradeTiers.map((t) => (
                <div
                  key={t.grade}
                  className="p-3 rounded-xl bg-white/[0.03] border border-white/5 flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white">{t.grade}</span>
                    <span className="text-slate-400 font-mono text-[11px]">
                      {t.count} ({Math.round((t.count / (metrics.total_students || 1)) * 100)}%)
                    </span>
                  </div>
                  <div className="mt-2 h-1.5 rounded-full bg-white/5 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        backgroundColor: t.color,
                        width: `${Math.round((t.count / (metrics.total_students || 1)) * 100)}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </GlassCard>

        {/* Top 5 Scorers Leaderboard */}
        <GlassCard hover={false} className="flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Trophy size={18} />
              </div>
              <div>
                <h3 className="font-heading text-base font-bold text-white">Top Performers</h3>
                <p className="text-xs text-slate-400">Highest examination marks in cohort</p>
              </div>
            </div>

            <div className="space-y-2.5">
              {topScorers.map((s, idx) => {
                const medals = [
                  'text-amber-400 bg-amber-500/10 border-amber-500/20',
                  'text-slate-300 bg-slate-300/10 border-slate-300/20',
                  'text-orange-400 bg-orange-500/10 border-orange-500/20',
                  'text-sky-400 bg-sky-500/10 border-sky-500/20',
                  'text-purple-400 bg-purple-500/10 border-purple-500/20',
                ];

                return (
                  <div
                    key={s.student_id}
                    onClick={() => onSelectStudent?.(s)}
                    className="p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 hover:border-cyan-500/30 transition cursor-pointer flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs border ${medals[idx]}`}
                      >
                        {idx + 1}
                      </div>
                      <div>
                        <span className="font-mono text-xs font-bold text-white">{s.student_id}</span>
                        <p className="text-[10px] text-slate-400">
                          Att: {s.attendance}% &bull; Study: {s.study_hours}h
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="stat-value text-base font-bold text-emerald-400">
                        {s.exam_marks}
                      </span>
                      <span className="text-[10px] text-slate-400 ml-0.5">/100</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 mt-4 text-center">
            <p className="text-[11px] text-slate-400">
              Click any student record to view full 5-axis profile
            </p>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
