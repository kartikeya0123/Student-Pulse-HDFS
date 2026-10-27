import { useMemo, useState } from 'react';
import {
  Search,
  Users,
  UserPlus,
  ArrowUpDown,
  Download,
  Filter,
  CheckCircle2,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Eye,
} from 'lucide-react';
import { GlassCard } from '@/components/GlassCard';
import type { Student } from '@/lib/supabase';

interface Props {
  students: Student[];
  onSelectStudent: (student: Student) => void;
  onOpenAddModal: () => void;
}

type FilterType = 'all' | 'distinction' | 'pass' | 'at_risk' | 'low_attendance';
type SortKey = 'student_id' | 'attendance' | 'study_hours' | 'previous_score' | 'assignment_marks' | 'exam_marks';

export function StudentExplorer({ students, onSelectStudent, onOpenAddModal }: Props) {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');
  const [sortKey, setSortKey] = useState<SortKey>('student_id');
  const [sortAsc, setSortAsc] = useState(true);
  const [page, setPage] = useState(1);
  const pageSize = 12;

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(false); // default descending for metrics
    }
  };

  const filtered = useMemo(() => {
    let list = [...students];

    // Search query
    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter((s) => s.student_id.toLowerCase().includes(q));
    }

    // Filter type
    if (filter === 'distinction') {
      list = list.filter((s) => (s.exam_marks ?? 0) >= 75);
    } else if (filter === 'pass') {
      list = list.filter((s) => (s.exam_marks ?? 0) >= 40 && (s.exam_marks ?? 0) < 75);
    } else if (filter === 'at_risk') {
      list = list.filter((s) => (s.exam_marks ?? 0) < 40 || (s.attendance ?? 0) < 60);
    } else if (filter === 'low_attendance') {
      list = list.filter((s) => (s.attendance ?? 0) < 75);
    }

    // Sorting
    list.sort((a, b) => {
      const valA = a[sortKey];
      const valB = b[sortKey];
      if (valA == null) return 1;
      if (valB == null) return -1;

      if (typeof valA === 'string' && typeof valB === 'string') {
        return sortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }
      return sortAsc ? (valA as number) - (valB as number) : (valB as number) - (valA as number);
    });

    return list;
  }, [students, query, filter, sortKey, sortAsc]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const exportCsv = () => {
    const headers = ['StudentID', 'Attendance', 'StudyHours', 'PreviousScore', 'AssignmentMarks', 'ExamMarks'];
    const rows = filtered.map((s) => [
      s.student_id,
      s.attendance ?? '',
      s.study_hours ?? '',
      s.previous_score ?? '',
      s.assignment_marks ?? '',
      s.exam_marks ?? '',
    ]);
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `studentpulse_dataset_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <GlassCard hover={false} className="space-y-4">
      {/* Action Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-2">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Users size={18} />
          </div>
          <div>
            <h3 className="font-heading text-lg font-bold text-white">Student Explorer</h3>
            <p className="text-xs text-slate-400">
              Showing {filtered.length} of {students.length} student records from Supabase
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap w-full lg:w-auto">
          {/* Search bar */}
          <div className="relative flex-1 sm:w-56">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by Student ID..."
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              className="glass-input w-full pl-9 pr-3 py-2 rounded-xl text-xs font-mono"
            />
          </div>

          <button
            onClick={exportCsv}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-xs font-medium transition"
          >
            <Download size={13} />
            Export CSV
          </button>

          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-sky-500 text-slate-950 font-bold text-xs hover:opacity-90 transition shadow-lg shadow-cyan-500/20"
          >
            <UserPlus size={14} />
            Add Student
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin text-xs">
        {[
          { id: 'all', label: 'All Records' },
          { id: 'distinction', label: 'Distinction (>=75%)' },
          { id: 'pass', label: 'Pass (40-74%)' },
          { id: 'at_risk', label: 'At Risk (<40%)' },
          { id: 'low_attendance', label: 'Low Attendance (<75%)' },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => {
              setFilter(f.id as FilterType);
              setPage(1);
            }}
            className={`px-3 py-1.5 rounded-xl border transition-all whitespace-nowrap font-medium ${
              filter === f.id
                ? 'bg-cyan-500/20 border-cyan-400/40 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                : 'bg-white/5 border-white/5 text-slate-400 hover:text-white hover:bg-white/10'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Glass Data Grid */}
      <div className="overflow-x-auto rounded-xl border border-white/10 scrollbar-thin">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-white/[0.04] text-slate-400 border-b border-white/10 font-mono text-[11px] uppercase tracking-wider select-none">
              <th onClick={() => handleSort('student_id')} className="py-3 px-4 cursor-pointer hover:text-white">
                <div className="flex items-center gap-1.5">
                  ID <ArrowUpDown size={12} />
                </div>
              </th>
              <th onClick={() => handleSort('attendance')} className="py-3 px-4 cursor-pointer hover:text-white">
                <div className="flex items-center gap-1.5">
                  Attendance <ArrowUpDown size={12} />
                </div>
              </th>
              <th onClick={() => handleSort('study_hours')} className="py-3 px-4 cursor-pointer hover:text-white">
                <div className="flex items-center gap-1.5">
                  Study Hours <ArrowUpDown size={12} />
                </div>
              </th>
              <th onClick={() => handleSort('previous_score')} className="py-3 px-4 cursor-pointer hover:text-white">
                <div className="flex items-center gap-1.5">
                  Prev Score <ArrowUpDown size={12} />
                </div>
              </th>
              <th onClick={() => handleSort('assignment_marks')} className="py-3 px-4 cursor-pointer hover:text-white">
                <div className="flex items-center gap-1.5">
                  Assignment <ArrowUpDown size={12} />
                </div>
              </th>
              <th onClick={() => handleSort('exam_marks')} className="py-3 px-4 cursor-pointer hover:text-white">
                <div className="flex items-center gap-1.5">
                  Exam Marks <ArrowUpDown size={12} />
                </div>
              </th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {paginated.map((s) => {
              const exam = s.exam_marks ?? 0;
              const att = s.attendance ?? 0;
              const isPass = exam >= 40;
              const isDist = exam >= 75;

              return (
                <tr
                  key={s.student_id}
                  onClick={() => onSelectStudent(s)}
                  className="hover:bg-white/[0.06] transition cursor-pointer group"
                >
                  <td className="py-3 px-4 font-mono font-bold text-cyan-400 group-hover:text-cyan-300">
                    {s.student_id}
                  </td>
                  <td className="py-3 px-4 font-medium text-slate-200">
                    <span className={att < 75 ? 'text-amber-400 font-semibold' : ''}>
                      {fmt(s.attendance)}%
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-300">
                    {fmt(s.study_hours)} hrs/wk
                  </td>
                  <td className="py-3 px-4 text-slate-300">
                    {fmt(s.previous_score)}
                  </td>
                  <td className="py-3 px-4 text-slate-300">
                    {fmt(s.assignment_marks)}
                  </td>
                  <td className="py-3 px-4 font-bold stat-value">
                    <span className={isDist ? 'text-emerald-400' : isPass ? 'text-cyan-300' : 'text-rose-400'}>
                      {fmt(s.exam_marks)}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {isDist ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                        Distinction
                      </span>
                    ) : isPass ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-500/15 text-sky-300 border border-sky-500/30">
                        Pass
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/15 text-rose-300 border border-rose-500/30">
                        At Risk
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectStudent(s);
                      }}
                      className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-cyan-300 transition"
                      title="View Profile Radar"
                    >
                      <Eye size={15} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="py-12 text-center text-slate-400">
            <p className="text-sm">No student records matching your query.</p>
          </div>
        )}
      </div>

      {/* Pagination Footer */}
      <div className="flex items-center justify-between text-xs text-slate-400 pt-2">
        <span>
          Page {currentPage} of {totalPages} ({filtered.length} items)
        </span>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 disabled:opacity-30 transition"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={() => setPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 disabled:opacity-30 transition"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </GlassCard>
  );
}

function fmt(v: number | null | undefined): string {
  return v == null ? '—' : v.toFixed(1);
}
