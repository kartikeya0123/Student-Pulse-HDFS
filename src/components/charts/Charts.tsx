import { useState } from 'react';
import type { Bucket, ScatterPoint } from '@/lib/analytics';

// ----------------- Bell Curve & Score Distribution -----------------
interface BellCurveProps {
  buckets: Bucket[];
  totalStudents: number;
}

export function BellCurveChart({ buckets, totalStudents }: BellCurveProps) {
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const maxCount = Math.max(1, ...buckets.map((b) => b.count));
  const svgHeight = 180;
  const svgWidth = 460;
  const barWidth = 60;
  const barGap = 24;
  const startX = 35;

  return (
    <div className="w-full">
      <div className="relative overflow-x-auto">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight + 40}`}
          className="w-full h-auto min-w-[360px] select-none"
        >
          <defs>
            <linearGradient id="barGlow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#0284c7" stopOpacity="0.3" />
            </linearGradient>
            <linearGradient id="barGlowActive" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#22d3ee" stopOpacity="1" />
              <stop offset="100%" stopColor="#0891b2" stopOpacity="0.6" />
            </linearGradient>
            <linearGradient id="curveFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          <line x1="30" y1={svgHeight} x2={svgWidth - 20} y2={svgHeight} stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
          <line x1="30" y1={svgHeight / 2} x2={svgWidth - 20} y2={svgHeight / 2} stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" strokeWidth="1" />

          {/* Bars */}
          {buckets.map((b, i) => {
            const h = (b.count / maxCount) * (svgHeight - 40);
            const x = startX + i * (barWidth + barGap);
            const y = svgHeight - h;
            const isHovered = hoverIdx === i;

            return (
              <g
                key={b.label}
                onMouseEnter={() => setHoverIdx(i)}
                onMouseLeave={() => setHoverIdx(null)}
                className="cursor-pointer transition-all duration-200"
              >
                {/* Bar */}
                <rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={Math.max(4, h)}
                  rx="6"
                  fill={isHovered ? 'url(#barGlowActive)' : 'url(#barGlow)'}
                  stroke={isHovered ? '#38bdf8' : 'rgba(255,255,255,0.15)'}
                  strokeWidth={isHovered ? 2 : 1}
                  className="transition-all duration-300"
                />

                {/* Count badge on top */}
                <text
                  x={x + barWidth / 2}
                  y={y - 8}
                  textAnchor="middle"
                  fill={isHovered ? '#38bdf8' : '#94a3b8'}
                  fontSize="12"
                  fontWeight="600"
                >
                  {b.count}
                </text>

                {/* X axis label */}
                <text
                  x={x + barWidth / 2}
                  y={svgHeight + 20}
                  textAnchor="middle"
                  fill="#94a3b8"
                  fontSize="10"
                  fontWeight="500"
                >
                  {b.label}
                </text>

                <text
                  x={x + barWidth / 2}
                  y={svgHeight + 34}
                  textAnchor="middle"
                  fill="#64748b"
                  fontSize="9"
                >
                  {Math.round((b.count / (totalStudents || 1)) * 100)}%
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {hoverIdx !== null && (
        <div className="mt-2 p-2.5 rounded-xl bg-white/5 border border-sky-500/20 text-xs flex items-center justify-between animate-fade-up">
          <span className="text-slate-300 font-medium">
            Bracket {buckets[hoverIdx].label}:
          </span>
          <span className="font-semibold text-cyan-400">
            {buckets[hoverIdx].count} students ({buckets[hoverIdx].percentage}% of class)
          </span>
        </div>
      )}
    </div>
  );
}

// ----------------- Interactive Scatter Plot (Attendance vs Exam) -----------------
interface ScatterPlotProps {
  points: ScatterPoint[];
}

export function ScatterPlot({ points }: ScatterPlotProps) {
  const [activePoint, setActivePoint] = useState<ScatterPoint | null>(null);

  const padding = 45;
  const width = 480;
  const height = 240;

  // Scale functions (0-100 to svg coords)
  const toX = (val: number) => padding + (val / 100) * (width - padding * 2);
  const toY = (val: number) => height - padding - (val / 100) * (height - padding * 2);

  // Compute simple regression line: y = mx + c
  const n = points.length || 1;
  const avgX = points.reduce((acc, p) => acc + p.x, 0) / n;
  const avgY = points.reduce((acc, p) => acc + p.y, 0) / n;
  let num = 0;
  let den = 0;
  points.forEach((p) => {
    num += (p.x - avgX) * (p.y - avgY);
    den += (p.x - avgX) ** 2;
  });
  const m = den === 0 ? 0.9 : num / den;
  const c = avgY - m * avgX;

  const regX1 = 30;
  const regY1 = Math.min(100, Math.max(0, m * regX1 + c));
  const regX2 = 100;
  const regY2 = Math.min(100, Math.max(0, m * regX2 + c));

  return (
    <div className="w-full">
      <div className="relative overflow-x-auto">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto min-w-[380px] select-none"
        >
          <defs>
            <filter id="dotGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="3" />
              <feMerge>
                <feMergeNode />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Grid lines */}
          <line x1={padding} y1={toY(0)} x2={width - padding} y2={toY(0)} stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
          <line x1={padding} y1={toY(50)} x2={width - padding} y2={toY(50)} stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />
          <line x1={padding} y1={toY(100)} x2={width - padding} y2={toY(100)} stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />
          <line x1={toX(50)} y1={toY(0)} x2={toX(50)} y2={toY(100)} stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />

          {/* Pass line at 40 */}
          <line
            x1={padding}
            y1={toY(40)}
            x2={width - padding}
            y2={toY(40)}
            stroke="#f43f5e"
            strokeDasharray="4 4"
            strokeWidth="1.2"
            opacity="0.6"
          />
          <text x={width - padding - 4} y={toY(40) - 4} textAnchor="end" fill="#f43f5e" fontSize="9">
            Pass Threshold (40)
          </text>

          {/* Regression line */}
          <line
            x1={toX(regX1)}
            y1={toY(regY1)}
            x2={toX(regX2)}
            y2={toY(regY2)}
            stroke="#10b981"
            strokeWidth="2.5"
            strokeDasharray="5 3"
            opacity="0.8"
          />

          {/* Axis Labels */}
          <text x={width / 2} y={height - 8} textAnchor="middle" fill="#94a3b8" fontSize="10" fontWeight="500">
            Attendance Percentage (%)
          </text>
          <text
            x={14}
            y={height / 2}
            textAnchor="middle"
            fill="#94a3b8"
            fontSize="10"
            fontWeight="500"
            transform={`rotate(-90 14 ${height / 2})`}
          >
            Exam Marks (/100)
          </text>

          {/* Points */}
          {points.map((p) => {
            const cx = toX(p.x);
            const cy = toY(p.y);
            const isSelected = activePoint?.id === p.id;
            const isPass = p.y >= 40;

            return (
              <g
                key={p.id}
                onMouseEnter={() => setActivePoint(p)}
                onMouseLeave={() => setActivePoint(null)}
                className="cursor-pointer"
              >
                {isSelected && (
                  <circle cx={cx} cy={cy} r="10" fill="none" stroke="#38bdf8" strokeWidth="1.5" className="animate-ping" />
                )}
                <circle
                  cx={cx}
                  cy={cy}
                  r={isSelected ? 6 : 4.5}
                  fill={isPass ? '#38bdf8' : '#f43f5e'}
                  stroke="rgba(255,255,255,0.7)"
                  strokeWidth="1"
                  filter={isSelected ? 'url(#dotGlow)' : undefined}
                  className="transition-all duration-200"
                />
              </g>
            );
          })}
        </svg>
      </div>

      {activePoint ? (
        <div className="mt-2 p-2.5 rounded-xl bg-white/5 border border-sky-400/30 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-mono text-cyan-400 font-bold">{activePoint.id}</span>
            <span className="px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-300 font-semibold text-[10px]">
              Grade: {activePoint.grade}
            </span>
          </div>
          <div className="flex items-center gap-4 text-slate-300">
            <span>Attendance: <strong className="text-white">{activePoint.x}%</strong></span>
            <span>Exam: <strong className="text-emerald-400">{activePoint.y}</strong></span>
            <span>Study: <strong className="text-amber-300">{activePoint.studyHours}h/wk</strong></span>
          </div>
        </div>
      ) : (
        <p className="text-[11px] text-slate-500 text-center mt-1">
          Hover over data points to inspect individual student correlation
        </p>
      )}
    </div>
  );
}

// ----------------- Pass Rate Donut Gauge -----------------
interface PassRateDonutProps {
  passRate: number;
  distinctionRate: number;
}

export function PassRateDonut({ passRate, distinctionRate }: PassRateDonutProps) {
  const size = 150;
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circ = 2 * Math.PI * radius;
  const passOffset = circ - (passRate / 100) * circ;
  const distOffset = circ - (distinctionRate / 100) * circ;

  return (
    <div className="flex items-center gap-6">
      <div className="relative w-[150px] h-[150px] shrink-0">
        <svg width={size} height={size} className="rotate-[-90deg]">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth={strokeWidth}
          />
          {/* Pass Ring */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="url(#passGrad)"
            strokeWidth={strokeWidth}
            strokeDasharray={circ}
            strokeDashoffset={passOffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
          {/* Distinction Inner Ring */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius - 12}
            fill="none"
            stroke="url(#distGrad)"
            strokeWidth={4}
            strokeDasharray={2 * Math.PI * (radius - 12)}
            strokeDashoffset={2 * Math.PI * (radius - 12) - (distinctionRate / 100) * 2 * Math.PI * (radius - 12)}
            strokeLinecap="round"
          />
          <defs>
            <linearGradient id="passGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
            <linearGradient id="distGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#818cf8" />
            </linearGradient>
          </defs>
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="stat-value text-2xl font-bold text-emerald-400">{passRate}%</span>
          <span className="text-[10px] uppercase tracking-wider text-slate-400">Pass Rate</span>
        </div>
      </div>

      <div className="space-y-2 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400" />
          <span className="text-slate-300">Passing (&ge;40):</span>
          <span className="font-semibold text-emerald-400 ml-auto">{passRate}%</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-gradient-to-r from-sky-400 to-indigo-400" />
          <span className="text-slate-300">Distinction (&ge;75):</span>
          <span className="font-semibold text-sky-400 ml-auto">{distinctionRate}%</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-rose-500" />
          <span className="text-slate-300">At Risk (&lt;40):</span>
          <span className="font-semibold text-rose-400 ml-auto">{Math.max(0, 100 - passRate)}%</span>
        </div>
      </div>
    </div>
  );
}

// ----------------- 5-Axis Student Performance Radar -----------------
interface RadarProps {
  metrics: {
    attendance: number;
    studyHours: number;
    previousScore: number;
    assignmentMarks: number;
    examMarks: number;
  };
  averages: {
    attendance: number;
    studyHours: number;
    previousScore: number;
    assignmentMarks: number;
    examMarks: number;
  };
}

export function PerformanceRadar({ metrics, averages }: RadarProps) {
  const size = 260;
  const center = size / 2;
  const r = 90;
  const axes = [
    { label: 'Attendance', key: 'attendance', max: 100 },
    { label: 'Study Hrs', key: 'studyHours', max: 10 },
    { label: 'Prev Score', key: 'previousScore', max: 100 },
    { label: 'Assignment', key: 'assignmentMarks', max: 100 },
    { label: 'Exam Marks', key: 'examMarks', max: 100 },
  ];

  const angleStep = (2 * Math.PI) / axes.length;

  const getCoord = (index: number, valRatio: number) => {
    const angle = index * angleStep - Math.PI / 2;
    const distance = Math.min(1, Math.max(0, valRatio)) * r;
    return {
      x: center + distance * Math.cos(angle),
      y: center + distance * Math.sin(angle),
    };
  };

  const studentPoints = axes.map((a, i) => {
    const val = metrics[a.key as keyof typeof metrics] ?? 0;
    return getCoord(i, val / a.max);
  });
  const avgPoints = axes.map((a, i) => {
    const val = averages[a.key as keyof typeof averages] ?? 0;
    return getCoord(i, val / a.max);
  });

  const toPath = (pts: { x: number; y: number }[]) =>
    pts.map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`)).join(' ') + ' Z';

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size} className="select-none">
        {/* Background webs */}
        {[0.25, 0.5, 0.75, 1.0].map((level) => {
          const webPoints = axes.map((_, i) => getCoord(i, level));
          return (
            <polygon
              key={level}
              points={webPoints.map((p) => `${p.x},${p.y}`).join(' ')}
              fill="none"
              stroke="rgba(255,255,255,0.08)"
              strokeWidth="1"
            />
          );
        })}

        {/* Axes lines */}
        {axes.map((_, i) => {
          const outer = getCoord(i, 1.0);
          return (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={outer.x}
              y2={outer.y}
              stroke="rgba(255,255,255,0.12)"
              strokeWidth="1"
            />
          );
        })}

        {/* Class Average Polygon */}
        <path
          d={toPath(avgPoints)}
          fill="rgba(148, 163, 184, 0.12)"
          stroke="#94a3b8"
          strokeWidth="1.5"
          strokeDasharray="3 3"
        />

        {/* Student Polygon */}
        <path
          d={toPath(studentPoints)}
          fill="rgba(56, 189, 248, 0.25)"
          stroke="#38bdf8"
          strokeWidth="2.5"
        />

        {/* Vertices */}
        {studentPoints.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="4" fill="#38bdf8" stroke="#fff" strokeWidth="1.5" />
        ))}

        {/* Labels */}
        {axes.map((a, i) => {
          const labelPt = getCoord(i, 1.25);
          return (
            <text
              key={i}
              x={labelPt.x}
              y={labelPt.y}
              textAnchor="middle"
              dominantBaseline="central"
              fill="#cbd5e1"
              fontSize="9"
              fontWeight="600"
            >
              {a.label}
            </text>
          );
        })}
      </svg>

      <div className="flex items-center gap-4 text-xs mt-2">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-sky-400" />
          <span className="text-sky-300 font-medium">This Student</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-1 bg-slate-400 border border-dashed border-slate-400" />
          <span className="text-slate-400">Class Average</span>
        </div>
      </div>
    </div>
  );
}
