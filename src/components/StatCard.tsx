import React from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  unit?: string;
  icon: React.ReactNode;
  accent?: 'cyan' | 'emerald' | 'amber' | 'rose' | 'purple';
  subtext?: string;
}

const colorMap = {
  cyan: {
    text: 'text-cyan-400',
    bg: 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400',
    borderHover: 'hover:border-cyan-400/40',
    glow: 'hover:shadow-[0_0_30px_rgba(6,182,212,0.18)]',
    bar: 'from-cyan-400 to-sky-500',
  },
  emerald: {
    text: 'text-emerald-400',
    bg: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
    borderHover: 'hover:border-emerald-400/40',
    glow: 'hover:shadow-[0_0_30px_rgba(16,185,129,0.18)]',
    bar: 'from-emerald-400 to-teal-500',
  },
  amber: {
    text: 'text-amber-400',
    bg: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
    borderHover: 'hover:border-amber-400/40',
    glow: 'hover:shadow-[0_0_30px_rgba(245,158,11,0.18)]',
    bar: 'from-amber-400 to-orange-500',
  },
  rose: {
    text: 'text-rose-400',
    bg: 'bg-rose-500/10 border-rose-500/20 text-rose-400',
    borderHover: 'hover:border-rose-400/40',
    glow: 'hover:shadow-[0_0_30px_rgba(244,63,94,0.18)]',
    bar: 'from-rose-400 to-pink-500',
  },
  purple: {
    text: 'text-purple-400',
    bg: 'bg-purple-500/10 border-purple-500/20 text-purple-400',
    borderHover: 'hover:border-purple-400/40',
    glow: 'hover:shadow-[0_0_30px_rgba(168,85,247,0.18)]',
    bar: 'from-purple-400 to-indigo-500',
  },
};

export function StatCard({
  label,
  value,
  unit,
  icon,
  accent = 'cyan',
  subtext,
}: StatCardProps) {
  const c = colorMap[accent];

  return (
    <div
      className={`glass-card rounded-2xl p-5 relative overflow-hidden backdrop-blur-xl transition-all duration-300 ${c.borderHover} ${c.glow}`}
    >
      {/* Top subtle highlight */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      
      <div className="flex items-start justify-between">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            {label}
          </span>
          <div className="flex items-baseline gap-1 mt-2">
            <span className={`stat-value text-2xl lg:text-3xl font-bold tracking-tight ${c.text}`}>
              {value}
            </span>
            {unit && <span className="text-xs font-medium text-slate-400">{unit}</span>}
          </div>
          {subtext && <p className="text-[11px] text-slate-400 mt-1">{subtext}</p>}
        </div>

        <div className={`p-2.5 rounded-xl border ${c.bg} shadow-inner`}>
          {icon}
        </div>
      </div>

      {/* Decorative mini bar indicator */}
      <div className="mt-3.5 h-1 w-full rounded-full bg-white/5 overflow-hidden">
        <div className={`h-full rounded-full bg-gradient-to-r ${c.bar} w-3/4 opacity-80`} />
      </div>
    </div>
  );
}
