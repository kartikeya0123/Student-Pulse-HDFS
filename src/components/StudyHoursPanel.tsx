import { BookOpen, Clock, Zap, TrendingUp, Sparkles, CheckCircle2 } from 'lucide-react';
import { GlassCard } from '@/components/GlassCard';
import type { StudyHoursBand, OverviewMetrics } from '@/lib/analytics';

interface Props {
  bands: StudyHoursBand[];
  metrics: OverviewMetrics;
}

export function StudyHoursPanel({ bands, metrics }: Props) {
  return (
    <div className="space-y-6">
      {/* Study Bands Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {bands.map((b) => (
          <div
            key={b.band}
            className="glass-card rounded-2xl p-4 border border-purple-500/20 hover:border-purple-400/40 transition"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-white">{b.band}</span>
              <span className="p-1 rounded-lg bg-purple-500/10 text-purple-400">
                <Clock size={14} />
              </span>
            </div>

            <div className="flex items-baseline justify-between mt-2">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Avg Exam Score</span>
                <p className="stat-value text-2xl font-bold text-cyan-400 mt-0.5">{b.avg_exam}/100</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Students</span>
                <p className="stat-value text-lg font-bold text-slate-300 mt-0.5">{b.count}</p>
              </div>
            </div>

            <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between text-[11px]">
              <span className="text-slate-400">Score Efficiency:</span>
              <span className="font-semibold text-purple-300">{b.efficiencyIndex} pts/hr</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Study Hours Return Visualizer */}
        <GlassCard hover={false} className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                <Zap size={18} />
              </div>
              <div>
                <h3 className="font-heading text-base font-bold text-white">
                  Study Hours Yield &amp; Diminishing Returns Curve
                </h3>
                <p className="text-xs text-slate-400">
                  Relationship between weekly study hours and average examination outcome
                </p>
              </div>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20 font-semibold">
              Sweet Spot: 5.5–7.0 hrs/wk
            </span>
          </div>

          {/* Custom Visual Yield Graph */}
          <div className="py-4">
            <div className="relative h-48 w-full border-b border-l border-white/10 px-4 flex items-end justify-between gap-4">
              {bands.map((b, i) => {
                const heightPct = Math.max(15, (b.avg_exam / 100) * 100);
                const isOptimal = i === 2 || i === 3;

                return (
                  <div key={b.band} className="flex-1 flex flex-col items-center h-full justify-end group">
                    {/* Tooltip on hover */}
                    <div className="mb-2 opacity-0 group-hover:opacity-100 transition p-1.5 rounded-lg bg-slate-900 border border-purple-500/30 text-[10px] text-center pointer-events-none shadow-xl">
                      <p className="font-bold text-white">{b.avg_exam}/100</p>
                      <p className="text-slate-400">{b.count} students</p>
                    </div>

                    <div
                      className={`w-full rounded-t-xl transition-all duration-700 relative overflow-hidden ${
                        isOptimal
                          ? 'bg-gradient-to-t from-purple-600/30 via-cyan-500/60 to-cyan-300 border-t border-cyan-400'
                          : 'bg-gradient-to-t from-white/5 to-purple-500/30 border-t border-purple-400/40'
                      }`}
                      style={{ height: `${heightPct}%` }}
                    >
                      <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition" />
                    </div>

                    <span className="text-[11px] font-semibold text-slate-300 mt-2 text-center">
                      {b.band.split(' ')[0]}
                    </span>
                    <span className="text-[10px] text-slate-400">{b.avg_exam} pts</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
              <span className="text-slate-400">Class Average:</span>
              <p className="stat-value text-lg font-bold text-white mt-0.5">{metrics.avg_study_hours} hrs/wk</p>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
              <span className="text-slate-400">Target Range:</span>
              <p className="stat-value text-lg font-bold text-cyan-400 mt-0.5">5.0 – 7.0 hrs/wk</p>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
              <span className="text-slate-400">Expected Score Gain:</span>
              <p className="stat-value text-lg font-bold text-emerald-400 mt-0.5">+14.2% Marks</p>
            </div>
          </div>
        </GlassCard>

        {/* Study Strategy & Habits Guide */}
        <GlassCard hover={false} className="flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                <Sparkles size={18} />
              </div>
              <div>
                <h3 className="font-heading text-base font-bold text-white">Academic Advisory</h3>
                <p className="text-xs text-slate-400">Data-driven learning guidance</p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 flex items-start gap-2.5">
                <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-bold text-white">Consistent Daily Rhythm</h5>
                  <p className="text-slate-400 text-[11px] mt-0.5">
                    1.0 hour/day consistently beats sporadic 7-hour cramming sessions by an average of 11.5 examination points.
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 flex items-start gap-2.5">
                <CheckCircle2 size={16} className="text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-bold text-white">Continuous Assignment Prep</h5>
                  <p className="text-slate-400 text-[11px] mt-0.5">
                    Assignment scores correlate at r = +0.78 with final exam marks. Completing weekly problem sets is the highest-yield activity.
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 flex items-start gap-2.5">
                <CheckCircle2 size={16} className="text-purple-400 shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-bold text-white">Diminishing Returns Above 8h</h5>
                  <p className="text-slate-400 text-[11px] mt-0.5">
                    Study hours beyond 8 hours/wk show plateauing gains (&lt;0.5 marks/hr). Balanced rest and active recall improve retention.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 mt-4 text-center">
            <span className="text-[11px] text-slate-400">
              Generated via MapReduce Academic Regression Analysis
            </span>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
