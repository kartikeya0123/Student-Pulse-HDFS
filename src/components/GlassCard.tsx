import type { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  glow?: 'cyan' | 'purple' | 'emerald' | 'amber' | 'none';
}

export function GlassCard({
  children,
  className = '',
  hover = true,
  glow = 'none',
}: GlassCardProps) {
  const glowMap = {
    none: '',
    cyan: 'hover:shadow-[0_0_30px_rgba(6,182,212,0.2)] hover:border-cyan-400/40',
    purple: 'hover:shadow-[0_0_30px_rgba(139,92,246,0.2)] hover:border-purple-400/40',
    emerald: 'hover:shadow-[0_0_30px_rgba(16,185,129,0.2)] hover:border-emerald-400/40',
    amber: 'hover:shadow-[0_0_30px_rgba(245,158,11,0.2)] hover:border-amber-400/40',
  };

  return (
    <div
      className={`glass-card rounded-2xl p-5 md:p-6 relative overflow-hidden backdrop-blur-xl ${
        hover ? 'hover:-translate-y-1' : ''
      } ${glowMap[glow]} ${className}`}
    >
      {/* Specular Top Border Highlight */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
      {children}
    </div>
  );
}
