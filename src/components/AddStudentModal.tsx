import { useState } from 'react';
import { X, UserPlus, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { insertStudentRecord } from '@/lib/analytics';
import type { Student } from '@/lib/supabase';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onAdded: (newStudent: Student) => void;
}

export function AddStudentModal({ isOpen, onClose, onAdded }: Props) {
  const [studentId, setStudentId] = useState('');
  const [attendance, setAttendance] = useState('85.0');
  const [studyHours, setStudyHours] = useState('5.0');
  const [previousScore, setPreviousScore] = useState('75.0');
  const [assignmentMarks, setAssignmentMarks] = useState('80.0');
  const [examMarks, setExamMarks] = useState('82.0');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const sId = studentId.trim().toUpperCase();
    if (!sId) {
      setError('Student ID is required (e.g. STU051)');
      return;
    }

    const att = parseFloat(attendance);
    const sh = parseFloat(studyHours);
    const ps = parseFloat(previousScore);
    const am = parseFloat(assignmentMarks);
    const em = parseFloat(examMarks);

    if (isNaN(att) || att < 0 || att > 100) {
      setError('Attendance must be between 0 and 100');
      return;
    }
    if (isNaN(sh) || sh < 0) {
      setError('Study hours must be 0 or greater');
      return;
    }
    if (isNaN(ps) || ps < 0 || ps > 100) {
      setError('Previous score must be between 0 and 100');
      return;
    }
    if (isNaN(am) || am < 0 || am > 100) {
      setError('Assignment marks must be between 0 and 100');
      return;
    }
    if (isNaN(em) || em < 0 || em > 100) {
      setError('Exam marks must be between 0 and 100');
      return;
    }

    setLoading(true);
    try {
      const created = await insertStudentRecord({
        student_id: sId,
        attendance: att,
        study_hours: sh,
        previous_score: ps,
        assignment_marks: am,
        exam_marks: em,
      });

      setSuccess(true);
      setTimeout(() => {
        onAdded(created);
        onClose();
      }, 700);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to write student record to Supabase');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-up">
      <div className="glass-panel w-full max-w-lg rounded-2xl p-6 relative border border-white/15 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition"
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
            <UserPlus size={20} />
          </div>
          <div>
            <h3 className="font-heading text-lg font-bold text-white">Add Academic Record</h3>
            <p className="text-xs text-slate-400">Persists directly to Supabase PostgreSQL table 'students'</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle size={16} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 size={16} className="shrink-0" />
            <span>Student successfully saved to Supabase!</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Student ID
            </label>
            <input
              type="text"
              placeholder="e.g. STU051"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              required
              className="glass-input w-full px-3.5 py-2.5 rounded-xl text-sm font-mono"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                Attendance (%)
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="100"
                value={attendance}
                onChange={(e) => setAttendance(e.target.value)}
                required
                className="glass-input w-full px-3.5 py-2 rounded-xl text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                Weekly Study Hours
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="50"
                value={studyHours}
                onChange={(e) => setStudyHours(e.target.value)}
                required
                className="glass-input w-full px-3.5 py-2 rounded-xl text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                Previous Score
              </label>
              <input
                type="number"
                step="0.5"
                min="0"
                max="100"
                value={previousScore}
                onChange={(e) => setPreviousScore(e.target.value)}
                required
                className="glass-input w-full px-3 py-2 rounded-xl text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                Assignment
              </label>
              <input
                type="number"
                step="0.5"
                min="0"
                max="100"
                value={assignmentMarks}
                onChange={(e) => setAssignmentMarks(e.target.value)}
                required
                className="glass-input w-full px-3 py-2 rounded-xl text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                Exam Marks
              </label>
              <input
                type="number"
                step="0.5"
                min="0"
                max="100"
                value={examMarks}
                onChange={(e) => setExamMarks(e.target.value)}
                required
                className="glass-input w-full px-3 py-2 rounded-xl text-sm"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-300 hover:bg-white/5 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-sky-500 text-slate-950 font-bold text-xs hover:opacity-90 transition disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? <Loader2 size={14} className="animate-spin" /> : <UserPlus size={14} />}
              Save to Supabase
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
