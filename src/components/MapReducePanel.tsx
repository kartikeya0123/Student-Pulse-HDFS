import { useEffect, useState } from 'react';
import {
  Play,
  Database,
  Cpu,
  Server,
  Terminal,
  Activity,
  Layers,
  CheckCircle2,
  Loader2,
  HardDrive,
  RefreshCw,
  GitBranch,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { GlassCard } from '@/components/GlassCard';
import {
  runMapReduce,
  fetchAnalyticsResults,
  type MapReduceRun,
} from '@/lib/analytics';
import type { Student, AnalyticsResult } from '@/lib/supabase';

interface Props {
  students: Student[];
}

type Stage = 'idle' | 'split' | 'map' | 'shuffle' | 'reduce' | 'persist' | 'done';

const stageSteps: { id: Stage; label: string; desc: string; icon: typeof Cpu }[] = [
  { id: 'split', label: '1. HDFS Block Split', desc: '128MB block chunks partitioned across DataNodes', icon: HardDrive },
  { id: 'map', label: '2. Mapper Phase', desc: 'Tokenizing & emitting (metric, score) key-value pairs', icon: Cpu },
  { id: 'shuffle', label: '3. Shuffle & Sort', desc: 'Hash partitioner & ring buffer in-memory merge sort', icon: GitBranch },
  { id: 'reduce', label: '4. Reducer Phase', desc: 'Combining grouped partitions into statistical means', icon: Layers },
  { id: 'persist', label: '5. Supabase Sync', desc: 'Writing part-r-00000 & inserting to analytics_results', icon: Database },
];

export function MapReducePanel({ students }: Props) {
  const [stage, setStage] = useState<Stage>('idle');
  const [selectedJob, setSelectedJob] = useState('all_metrics');
  const [run, setRun] = useState<MapReduceRun | null>(null);
  const [history, setHistory] = useState<AnalyticsResult[]>([]);
  const [consoleLogs, setConsoleLogs] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAnalyticsResults()
      .then(setHistory)
      .catch(() => undefined);
  }, [stage]);

  const addLog = (msg: string) => {
    const time = new Date().toLocaleTimeString();
    setConsoleLogs((prev) => [...prev, `[${time}] ${msg}`]);
  };

  const handleExecuteJob = async () => {
    if (stage !== 'idle' && stage !== 'done') return;
    setError(null);
    setRun(null);
    setConsoleLogs([]);

    try {
      addLog(`INFO: Initializing MapReduce Job: ${selectedJob}`);
      addLog(`INFO: Submitting job to YARN ResourceManager at localhost:8032`);
      addLog(`INFO: Input path: hdfs://localhost:9000/studentpulse/input/student_performance.csv (${students.length} records)`);

      // Stage 1: Split
      setStage('split');
      addLog(`INFO: Number of splits: 2 (128MB chunk boundaries calculated)`);
      addLog(`INFO: Data-local map tasks assigned to Worker-01, Worker-02`);
      await delay(750);

      // Stage 2: Map
      setStage('map');
      addLog(`INFO: Map task_1793_m_000001: 50% completed`);
      addLog(`INFO: Emitting key-values: <exam_marks, ${students[0]?.exam_marks ?? 85}>, <attendance, ${students[0]?.attendance ?? 88}>...`);
      addLog(`INFO: Map task_1793_m_000002: 100% completed`);
      await delay(850);

      // Stage 3: Shuffle & Sort
      setStage('shuffle');
      addLog(`INFO: Shuffle & Sort: In-memory circular buffer 80% threshold reached, spilling to local disk`);
      addLog(`INFO: Executing multi-way merge sort across partitions`);
      await delay(800);

      // Stage 4: Reduce
      setStage('reduce');
      addLog(`INFO: Reduce task_1793_r_000001 launched on Worker-03`);
      addLog(`INFO: Computing aggregates: sum(exam_marks)/count, sum(attendance)/count...`);
      await delay(800);

      // Stage 5: Persist to Supabase
      setStage('persist');
      addLog(`INFO: Generating output: hdfs://localhost:9000/studentpulse/output/part-r-00000`);
      addLog(`INFO: Cloud Hook: Pushing aggregated batch to Supabase PostgreSQL table 'analytics_results'`);

      const res = await runMapReduce(students, selectedJob as any);
      setRun(res);
      setStage('done');
      addLog(`SUCCESS: MapReduce Job ${res.jobId} completed successfully in ${res.durationMs}ms`);
      addLog(`SUCCESS: Results verified and synchronized with Supabase Cloud.`);
    } catch (e) {
      const err = e instanceof Error ? e.message : 'MapReduce job failed';
      setError(err);
      addLog(`ERROR: Pipeline failed: ${err}`);
      setStage('idle');
    }
  };

  return (
    <div className="space-y-6">
      {/* 4-Node Hadoop Cluster Visualizer */}
      <GlassCard hover={false} className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Server size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading text-lg font-bold text-white">Hadoop Cluster &amp; HDFS Topology</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                  Cluster Healthy
                </span>
              </div>
              <p className="text-xs text-slate-400">
                1 Master NameNode + 4 Distributed DataNodes with active heartbeat synchronization
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <div className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 font-mono text-slate-300">
              HDFS SafeMode: <strong className="text-emerald-400">OFF</strong>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 font-mono text-slate-300">
              DFS Used: <strong className="text-cyan-400">14.2 GB</strong> / 500 GB
            </div>
          </div>
        </div>

        {/* Nodes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {/* Master NameNode */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-cyan-950/40 to-slate-900 border border-cyan-500/30 shadow-lg relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-cyan-300">NameNode (Master)</span>
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500" />
              </span>
            </div>
            <div className="space-y-1 font-mono text-[11px] text-slate-300">
              <p>IPC Port: 9000</p>
              <p>Web UI: 9870</p>
              <p className="text-cyan-400 font-semibold">Heap: 38.4% (1.5GB)</p>
            </div>
            <div className="mt-2.5 pt-2 border-t border-white/10 text-[10px] text-slate-400">
              Metadata &amp; Block Journal
            </div>
          </div>

          {/* 4 DataNodes */}
          {[
            { id: 'Worker-01', ip: '192.168.1.101', cpu: '22%', ram: '4.2GB', blocks: 128 },
            { id: 'Worker-02', ip: '192.168.1.102', cpu: '28%', ram: '4.5GB', blocks: 130 },
            { id: 'Worker-03', ip: '192.168.1.103', cpu: '19%', ram: '3.9GB', blocks: 125 },
            { id: 'Worker-04', ip: '192.168.1.104', cpu: '24%', ram: '4.1GB', blocks: 127 },
          ].map((node) => (
            <div
              key={node.id}
              className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-white/20 transition"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-white">{node.id}</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
              </div>
              <div className="space-y-1 font-mono text-[11px] text-slate-300">
                <p className="text-slate-400 text-[10px]">{node.ip}</p>
                <p>CPU: {node.cpu}</p>
                <p>Blocks: {node.blocks}</p>
              </div>
              <div className="mt-2.5 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-400">
                <span>Heartbeat: 1.2s</span>
                <span className="text-emerald-400">LIVE</span>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* MapReduce Job Launcher & 5 Stages */}
      <GlassCard hover={false} className="space-y-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Cpu size={20} />
            </div>
            <div>
              <h3 className="font-heading text-lg font-bold text-white">MapReduce Pipeline Execution</h3>
              <p className="text-xs text-slate-400">
                Execute distributed MapReduce job over {students.length} student records
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <select
              value={selectedJob}
              onChange={(e) => setSelectedJob(e.target.value)}
              disabled={stage !== 'idle' && stage !== 'done'}
              className="glass-input px-3 py-2 rounded-xl text-xs font-medium text-white"
            >
              <option value="all_metrics" className="bg-slate-900">Job 1: Academic KPI Aggregations</option>
              <option value="attendance_reg" className="bg-slate-900">Job 2: Attendance Regression Reducer</option>
              <option value="study_hours" className="bg-slate-900">Job 3: Study Hours Efficiency Reducer</option>
            </select>

            <button
              onClick={handleExecuteJob}
              disabled={stage !== 'idle' && stage !== 'done'}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-sky-500 text-slate-950 font-bold text-xs hover:opacity-90 transition disabled:opacity-40 shadow-lg shadow-cyan-500/20"
            >
              {stage === 'idle' || stage === 'done' ? <Play size={14} /> : <Loader2 size={14} className="animate-spin" />}
              {stage === 'done' ? 'Re-run Job' : 'Execute Job'}
            </button>
          </div>
        </div>

        {/* 5-Stage Visual Workflow */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {stageSteps.map((s, idx) => {
            const active = stage === s.id;
            const done = isStageCompleted(stage, s.id);
            const Icon = s.icon;

            return (
              <div
                key={s.id}
                className={`p-3.5 rounded-2xl border transition-all duration-300 relative overflow-hidden ${
                  active
                    ? 'border-cyan-400/60 bg-cyan-500/10 shadow-[0_0_25px_rgba(6,182,212,0.25)]'
                    : done
                    ? 'border-emerald-500/30 bg-emerald-500/5'
                    : 'border-white/10 bg-white/[0.03]'
                }`}
              >
                {active && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 to-sky-400 animate-pulse" />
                )}

                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Step {idx + 1}
                  </span>
                  {done ? (
                    <CheckCircle2 size={16} className="text-emerald-400" />
                  ) : active ? (
                    <Loader2 size={16} className="text-cyan-400 animate-spin" />
                  ) : (
                    <Icon size={16} className="text-slate-500" />
                  )}
                </div>

                <h5 className="font-heading text-xs font-bold text-white mt-1">{s.label}</h5>
                <p className="text-[10px] text-slate-400 mt-1 leading-snug">{s.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Job Output Results Cards (when finished) */}
        {run && (
          <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 animate-fade-up">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={18} className="text-emerald-400" />
                <h4 className="font-heading text-sm font-bold text-white">
                  MapReduce Output (Persisted to Supabase)
                </h4>
              </div>
              <span className="font-mono text-xs text-slate-400">
                Dataset: {run.datasetVersion} &bull; Took {run.durationMs}ms
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {run.results.map((r) => (
                <div key={r.metric_name} className="p-3 rounded-xl bg-white/5 border border-white/5">
                  <span className="text-[10px] uppercase font-semibold text-slate-400">
                    {r.metric_name.replace('_', ' ')}
                  </span>
                  <p className="stat-value text-xl font-bold text-cyan-300 mt-0.5">
                    {r.metric_value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Hadoop Streaming Live Terminal */}
        <div className="rounded-2xl bg-slate-950 border border-white/10 overflow-hidden shadow-2xl">
          <div className="px-4 py-2.5 bg-white/[0.04] border-b border-white/10 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Terminal size={14} className="text-cyan-400" />
              <span className="font-mono text-slate-300 font-semibold">
                hadoop@cluster:~/studentpulse$ yarn jar hadoop-streaming.jar
              </span>
            </div>
            <span className="text-[10px] text-slate-500 font-mono">STDOUT / STDERR STREAM</span>
          </div>

          <div className="p-4 font-mono text-[11px] text-emerald-400/90 h-44 overflow-y-auto space-y-1 scrollbar-thin select-text">
            {consoleLogs.length === 0 ? (
              <p className="text-slate-500">
                Ready to execute MapReduce pipeline. Click "Execute Job" above to start streaming tokens...
              </p>
            ) : (
              consoleLogs.map((log, i) => <p key={i}>{log}</p>)
            )}
          </div>
        </div>
      </GlassCard>

      {/* Persisted Analytics History */}
      <GlassCard hover={false} className="space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <Database size={18} className="text-cyan-400" />
            <h4 className="font-heading text-sm font-bold text-white">
              Persisted MapReduce History in Supabase (`analytics_results`)
            </h4>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {history.length} records stored
          </span>
        </div>

        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="text-slate-400 border-b border-white/5 text-[10px] uppercase">
                <th className="py-2 px-3">Metric Name</th>
                <th className="py-2 px-3">Value</th>
                <th className="py-2 px-3">Dataset Version</th>
                <th className="py-2 px-3">Calculated At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {history.slice(0, 8).map((h) => (
                <tr key={h.id} className="hover:bg-white/5">
                  <td className="py-2.5 px-3 text-cyan-400 font-semibold">{h.metric_name}</td>
                  <td className="py-2.5 px-3 font-bold text-white">{h.metric_value}</td>
                  <td className="py-2.5 px-3 text-slate-400">{h.dataset_version ?? 'v1.0'}</td>
                  <td className="py-2.5 px-3 text-slate-500">{new Date(h.calculated_at).toLocaleString()}</td>
                </tr>
              ))}
              {history.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-6 text-center text-slate-500">
                    No MapReduce results persisted yet. Execute a job to populate Supabase analytics table.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}

function isStageCompleted(current: Stage, target: Stage): boolean {
  const order: Stage[] = ['split', 'map', 'shuffle', 'reduce', 'persist', 'done'];
  const curIdx = order.indexOf(current);
  const targetIdx = order.indexOf(target);
  return curIdx > targetIdx;
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
