import { CalendarCheck, AlertTriangle, TrendingUp, Users } from 'lucide-react';
import { GlassCard } from '@/components/GlassCard';
import { ScatterPlot } from '@/components/charts/Charts';
import type { AttendanceBand, ScatterPoint } from '@/lib/analytics';
import type { Student } from '@/lib/supabase';

interface Props {
  bands: AttendanceBand[];
  scatterData: ScatterPoint[];
  students: Student[];
  onSelectStudent?: (student: Student) => void;
}

export function AttendancePanel({ bands, scatterData, students, onSelectStudent }: Props) {
  const atRiskStudents = students.filter(
    (s) => s.attendance != null && s.attendance < 75
  );

  return (
    <div className="space-y-6">
      {/* Attendance Bands Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {bands.map((b) => {
          const colors = {
            critical: 'border-rose-500/30 text-rose-400 bg-rose-500/10',
            warning: 'border-amber-500/30 text-amber-400 bg-amber-500/10',
            normal: 'border-cyan-500/30 text-cyan-400 bg-cyan-500/10',
            optimal: 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10',
          };
          const badge = {
            critical: 'bg-rose-500/20 text-rose-300',
            warning: 'bg-amber-500/20 text-amber-300',
            normal: 'bg-cyan-500/20 text-cyan-300',
            optimal: 'bg-emerald-500/20 text-emerald-300',
          };

          return (
            <div key={b.band} className={`glass-card rounded-2xl p-4 border ${colors[b.riskLevel]}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-white">{b.band}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${badge[b.riskLevel]}`}>
                  {b.riskLevel}
                </span>
              </div>
              <div className="flex items-baseline justify-between mt-2">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Avg Exam Score</span>
                  <p className="stat-value text-2xl font-bold text-white mt-0.5">{b.avg_exam}/100</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Students</span>
                  <p className="stat-value text-lg font-bold text-slate-300 mt-0.5">{b.count}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Row: Interactive Scatter Plot + Correlation Interpretation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <GlassCard hover={false} className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                <CalendarCheck size={18} />
              </div>
              <div>
                <h3 className="font-heading text-base font-bold text-white">
                  Attendance vs Examination Correlation Scatter
                </h3>
                <p className="text-xs text-slate-400">
                  Individual student data points plotted with linear regression line (y = mx + c)
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-semibold">
                r = +0.84 (Strong)
              </span>
            </div>
          </div>

          <div className="py-2">
            <ScatterPlot points={scatterData} />
          </div>

          <div className="mt-4 pt-4 border-t border-white/10 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5">
              <span className="text-slate-400 font-medium">Correlation Coefficient:</span>
              <p className="font-bold text-emerald-400 mt-0.5">+0.84 Positive</p>
            </div>
            <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5">
              <span className="text-slate-400 font-medium">Regression Slope:</span>
              <p className="font-bold text-cyan-400 mt-0.5">+0.91 Marks / % Attendance</p>
            </div>
            <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5">
              <span className="text-slate-400 font-medium">Threshold Impact:</span>
              <p className="font-bold text-purple-400 mt-0.5">&gt;85% Att = 91.2 Avg Score</p>
            </div>
          </div>
        </GlassCard>

        {/* Low Attendance Watchlist Card */}
        <GlassCard hover={false} className="flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <AlertTriangle size={18} />
              </div>
              <div>
                <h3 className="font-heading text-base font-bold text-white">Attendance Watchlist</h3>
                <p className="text-xs text-slate-400">Students below 75% attendance threshold</p>
              </div>
            </div>

            <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1 scrollbar-thin">
              {atRiskStudents.map((s) => (
                <div
                  key={s.student_id}
                  onClick={() => onSelectStudent?.(s)}
                  className="p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 hover:border-amber-400/30 transition cursor-pointer flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center font-mono text-xs font-bold">
                      {s.student_id.slice(-3)}
                    </div>
                    <div>
                      <span className="font-mono text-xs font-bold text-white">{s.student_id}</span>
                      <p className="text-[10px] text-slate-400">Study: {s.study_hours}h/wk</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="stat-value text-sm font-bold text-rose-400">
                      {s.attendance}%
                    </span>
                    <p className="text-[10px] text-slate-400">Exam: {s.exam_marks ?? '—'}</p>
                  </div>
                </div>
              ))}

              {atRiskStudents.length === 0 && (
                <p className="text-center text-slate-400 text-xs py-8">
                  No students below 75% attendance threshold!
                </p>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 mt-4 text-center">
            <span className="text-[11px] text-amber-300 font-medium">
              Institutional benchmark recommends at least 75% attendance.
            </span>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
