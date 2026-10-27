import { useEffect, useMemo, useState } from 'react';
import {
  LayoutDashboard,
  GraduationCap,
  CalendarCheck,
  BookOpen,
  Users,
  ShieldCheck,
  Database,
  Cloud,
  Activity,
  AlertCircle,
  Menu,
  X,
} from 'lucide-react';
import type { Student } from '@/lib/supabase';
import {
  fetchStudents,
  checkBackendHealth,
  computeOverview,
  computeExamDistribution,
  computeAttendanceBands,
  computeStudyHoursBands,
  computeScatterData,
  computeDataQuality,
} from '@/lib/analytics';
import { Header } from '@/components/Header';
import { OverviewPanel } from '@/components/OverviewPanel';
import { ExamPanel } from '@/components/ExamPanel';
import { AttendancePanel } from '@/components/AttendancePanel';
import { StudyHoursPanel } from '@/components/StudyHoursPanel';
import { StudentExplorer } from '@/components/StudentExplorer';
import { MapReducePanel } from '@/components/MapReducePanel';
import { SupabaseCloudHub } from '@/components/SupabaseCloudHub';
import { DataQualityPanel } from '@/components/DataQualityPanel';
import { AddStudentModal } from '@/components/AddStudentModal';
import { StudentProfileDrawer } from '@/components/StudentProfileDrawer';

type View =
  | 'overview'
  | 'exams'
  | 'attendance'
  | 'study'
  | 'explorer'
  | 'hadoop'
  | 'supabase'
  | 'quality';

const navItems: { id: View; label: string; icon: typeof LayoutDashboard; badge?: string }[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'exams', label: 'Exam Performance', icon: GraduationCap },
  { id: 'attendance', label: 'Attendance', icon: CalendarCheck },
  { id: 'study', label: 'Study Hours', icon: BookOpen },
  { id: 'explorer', label: 'Student Explorer', icon: Users },
  { id: 'hadoop', label: 'Hadoop Pipeline', icon: Database, badge: 'Big Data' },
  { id: 'supabase', label: 'Supabase Cloud Hub', icon: Cloud, badge: 'Replaces AWS' },
  { id: 'quality', label: 'Data Quality', icon: ShieldCheck },
];

function App() {
  const [view, setView] = useState<View>('overview');
  const [students, setStudents] = useState<Student[]>([]);
  const [dataSource, setDataSource] = useState('Loading...');
  const [backendOnline, setBackendOnline] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const loadData = () => {
    setLoading(true);
    setError(null);
    fetchStudents()
      .then(({ data, source }) => {
        setStudents(data);
        setDataSource(source);
        setLoading(false);
      })
      .catch((e) => {
        setError(e instanceof Error ? e.message : 'Failed to load records from Supabase');
        setLoading(false);
      });

    // Check Flask backend
    checkBackendHealth().then((health) => {
      setBackendOnline(health !== null);
    });
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(() => {
      checkBackendHealth().then((health) => setBackendOnline(health !== null));
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  const overview = useMemo(() => computeOverview(students), [students]);
  const examDist = useMemo(() => computeExamDistribution(students), [students]);
  const attendanceBands = useMemo(() => computeAttendanceBands(students), [students]);
  const studyBands = useMemo(() => computeStudyHoursBands(students), [students]);
  const scatterData = useMemo(() => computeScatterData(students), [students]);
  const quality = useMemo(() => computeDataQuality(students), [students]);

  const handleStudentAdded = (newStudent: Student) => {
    setStudents((prev) => [newStudent, ...prev]);
  };

  return (
    <div className="relative min-h-screen bg-[#030712] text-slate-100 overflow-x-hidden">
      {/* Background Ambient Mesh Glowing Orbs */}
      <div className="orb-glow w-[520px] h-[520px] bg-cyan-600/25 -top-32 -left-20 animate-orb-1" />
      <div className="orb-glow w-[480px] h-[480px] bg-purple-600/20 top-1/3 -right-24 animate-orb-2" />
      <div className="orb-glow w-[420px] h-[420px] bg-emerald-600/20 bottom-0 left-1/4 animate-orb-3" />

      {/* Top Header */}
      <Header
        dataSource={dataSource}
        backendOnline={backendOnline}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        onRunHadoop={() => setView('hadoop')}
        onRefresh={loadData}
        totalStudents={students.length}
      />

      <div className="relative z-10 flex min-h-[calc(100vh-65px)]">
        {/* Glassmorphic Sidebar */}
        <aside className="hidden lg:flex flex-col w-64 shrink-0 border-r border-white/10 bg-white/[0.02] backdrop-blur-2xl p-5 justify-between">
          <div>
            <div className="mb-6 px-3 py-2 rounded-xl bg-white/[0.03] border border-white/5 text-[11px] text-slate-400">
              <span className="text-cyan-400 font-bold block mb-0.5">Active Source</span>
              {dataSource}
            </div>

            <nav className="space-y-1.5">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = view === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setView(item.id)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${active
                      ? 'bg-gradient-to-r from-cyan-500/20 to-sky-500/10 text-cyan-300 border border-cyan-400/40 shadow-[0_0_20px_rgba(6,182,212,0.15)]'
                      : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon size={17} className={active ? 'text-cyan-400' : 'text-slate-400'} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span
                        className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${active
                          ? 'bg-cyan-400/20 text-cyan-200'
                          : 'bg-white/5 text-slate-400'
                          }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Sidebar Footer: Stack Badge */}
          <div className="pt-4 border-t border-white/10">
            <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 text-[11px] text-slate-400 space-y-1">
              <div className="flex items-center justify-between font-bold text-white mb-1">
                <span>Architecture</span>
                <span className="text-[10px] text-emerald-400">Integrated</span>
              </div>
              <p>&bull; Apache Hadoop MapReduce</p>
              <p>&bull; Supabase PostgreSQL (vs RDS)</p>
              <p>&bull; Supabase Storage (vs S3)</p>
              <p>&bull; Flask REST API</p>
            </div>
          </div>
        </aside>

        {/* Mobile Navigation Header */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 glass-panel border-t border-white/10 px-3 py-2 flex items-center justify-around">
          {navItems.slice(0, 5).map((item) => {
            const Icon = item.icon;
            const active = view === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setView(item.id)}
                className={`p-2 rounded-xl flex flex-col items-center text-[10px] ${active ? 'text-cyan-400 font-bold' : 'text-slate-400'
                  }`}
              >
                <Icon size={18} />
                <span className="mt-1">{item.label.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>

        {/* Main Content Area */}
        <main className="flex-1 p-5 md:p-8 pb-24 lg:pb-8 overflow-y-auto">
          {/* Section Title Header */}
          <div className="mb-6 animate-fade-up">
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-bold tracking-widest text-cyan-400">
                Analytics Module
              </span>
            </div>
            <h2 className="font-heading text-2xl md:text-3xl font-extrabold text-white mt-1">
              {currentTitle(view)}
            </h2>
            <p className="text-slate-400 text-xs md:text-sm mt-1">{currentSubtitle(view)}</p>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="glass-panel rounded-2xl p-12 text-center text-slate-400 flex flex-col items-center justify-center gap-3">
              <Activity className="animate-spin text-cyan-400" size={32} />
              <p className="text-sm font-medium">Connecting to Supabase PostgreSQL &amp; retrieving records...</p>
            </div>
          )}

          {/* Error Banner */}
          {error && !loading && (
            <div className="glass-panel rounded-2xl p-6 border border-rose-500/30 flex items-start gap-3 mb-6">
              <AlertCircle className="text-rose-400 shrink-0 mt-0.5" size={20} />
              <div>
                <p className="font-semibold text-rose-200">Supabase Connection Notice</p>
                <p className="text-xs text-slate-400 mt-1">{error}</p>
                <button
                  onClick={loadData}
                  className="mt-3 px-3 py-1.5 rounded-lg bg-rose-500/20 text-rose-200 text-xs font-semibold hover:bg-rose-500/30 transition"
                >
                  Retry Connection
                </button>
              </div>
            </div>
          )}

          {/* Tab Views */}
          {!loading && !error && (
            <div className="space-y-6 animate-fade-up">
              {view === 'overview' && (
                <OverviewPanel
                  metrics={overview}
                  onNavigateTab={(tab) => setView(tab as View)}
                />
              )}

              {view === 'exams' && (
                <ExamPanel
                  distribution={examDist}
                  metrics={overview}
                  students={students}
                  onSelectStudent={(s) => setSelectedStudent(s)}
                />
              )}

              {view === 'attendance' && (
                <AttendancePanel
                  bands={attendanceBands}
                  scatterData={scatterData}
                  students={students}
                  onSelectStudent={(s) => setSelectedStudent(s)}
                />
              )}

              {view === 'study' && (
                <StudyHoursPanel bands={studyBands} metrics={overview} />
              )}

              {view === 'explorer' && (
                <StudentExplorer
                  students={students}
                  onSelectStudent={(s) => setSelectedStudent(s)}
                  onOpenAddModal={() => setIsAddModalOpen(true)}
                />
              )}

              {view === 'hadoop' && <MapReducePanel students={students} />}

              {view === 'supabase' && (
                <SupabaseCloudHub
                  students={students}
                  onRefreshData={loadData}
                />
              )}

              {view === 'quality' && (
                <DataQualityPanel report={quality} />
              )}
            </div>
          )}
        </main>
      </div>

      {/* Modals & Drawers */}
      <AddStudentModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdded={handleStudentAdded}
      />

      <StudentProfileDrawer
        student={selectedStudent}
        overview={overview}
        onClose={() => setSelectedStudent(null)}
      />
    </div>
  );
}

function currentTitle(view: View): string {
  switch (view) {
    case 'overview':
      return 'Academic Performance Overview';
    case 'exams':
      return 'Examination Performance & Distribution';
    case 'attendance':
      return 'Attendance Analysis & Exam Correlation';
    case 'study':
      return 'Study-Hour Yield & Workload Analysis';
    case 'explorer':
      return 'Student Explorer & Profiler';
    case 'hadoop':
      return 'Apache Hadoop & MapReduce Hub';
    case 'supabase':
      return 'Supabase Cloud Infrastructure';
    case 'quality':
      return 'Data Hygiene & Pipeline Validation';
  }
}

function currentSubtitle(view: View): string {
  switch (view) {
    case 'overview':
      return 'Executive summary KPIs, pass-rate breakdown, and big data architecture metrics';
    case 'exams':
      return 'Standardized grade tiers, score histogram, bell curve distribution, and top performers';
    case 'attendance':
      return 'Attendance bands compared with examination outcomes and scatter regression curve';
    case 'study':
      return 'Weekly study hours return curve, optimal study thresholds, and assignment correlation';
    case 'explorer':
      return 'Search, filter, and inspect individual student academic records and 5-axis profile radar';
    case 'hadoop':
      return 'Distributed MapReduce pipeline execution over HDFS with live streaming console';
    case 'supabase':
      return 'Supabase PostgreSQL & Object Storage replacing AWS S3/RDS for cloud data persistence';
    case 'quality':
      return 'Integrity inspection, missing value scanner, duplicate check, and schema conformance';
  }
}

export default App;
