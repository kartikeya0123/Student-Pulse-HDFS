interface Bar {
  label: string;
  value: number;
  sublabel?: string;
}

interface BarChartProps {
  bars: Bar[];
  color?: string;
  unit?: string;
  max?: number;
}

export function BarChart({ bars, color = 'from-sky-400 to-cyan-300', unit = '', max }: BarChartProps) {
  const maxVal = max ?? Math.max(1, ...bars.map((b) => b.value));
  return (
    <div className="space-y-3">
      {bars.map((b, i) => (
        <div key={b.label} className="group">
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-muted">{b.label}{b.sublabel ? ` · ${b.sublabel}` : ''}</span>
            <span className="stat-num text-primary">{b.value}{unit}</span>
          </div>
          <div className="h-2.5 rounded-full bg-white/5 overflow-hidden">
            <div
              className={`h-full rounded-full bg-gradient-to-r ${color} transition-all duration-700 ease-out`}
              style={{ width: `${(b.value / maxVal) * 100}%`, animationDelay: `${i * 60}ms` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
