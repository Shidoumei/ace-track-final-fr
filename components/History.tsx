
import React, { useState, useMemo } from 'react';
import { Subject, PaperProgress } from '../types';
import PaperDetailModal from './PaperDetailModal';

interface HistoryProps {
  subjects: Subject[];
  progress: PaperProgress[];
  onDelete: (paperId: string) => void;
}

const History: React.FC<HistoryProps> = ({ subjects, progress, onDelete }) => {
  const [selectedPaper, setSelectedPaper] = useState<PaperProgress | null>(null);
  const [filters, setFilters] = useState({
    subject: 'All',
    paperType: 'All',
    variant: 'All',
    session: 'All',
    fromDate: '',
    toDate: ''
  });

  const handleReset = () => {
    setFilters({
      subject: 'All',
      paperType: 'All',
      variant: 'All',
      session: 'All',
      fromDate: '',
      toDate: ''
    });
  };

  const filteredHistory = useMemo(() => {
    return progress.filter(p => {
      const matchSubject = filters.subject === 'All' || p.subjectId === filters.subject;
      const matchType = filters.paperType === 'All' || p.component === filters.paperType;
      const matchVariant = filters.variant === 'All' || String(p.variant) === filters.variant;
      const matchSession = filters.session === 'All' || p.session === filters.session;
      
      let matchDate = true;
      if (p.dateCompleted) {
        if (filters.fromDate && p.dateCompleted < filters.fromDate) matchDate = false;
        if (filters.toDate && p.dateCompleted > filters.toDate) matchDate = false;
      }

      return matchSubject && matchType && matchVariant && matchSession && matchDate;
    }).sort((a, b) => new Date(b.dateCompleted || 0).getTime() - new Date(a.dateCompleted || 0).getTime());
  }, [progress, filters]);

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-2 duration-500">
      {/* Redesigned Filter Bar - No Overlap */}
      <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-800 transition-colors">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <FilterSelect 
            label="SUBJECT" 
            value={filters.subject} 
            options={['All', ...subjects.map(s => ({ value: s.id, label: s.name }))]}
            onChange={(val: string) => setFilters(f => ({ ...f, subject: val }))}
          />
          <FilterSelect 
            label="COMPONENT" 
            value={filters.paperType} 
            options={['All', 'P1', 'P2', 'P3', 'P4']}
            onChange={(val: string) => setFilters(f => ({ ...f, paperType: val }))}
          />
          <FilterSelect 
            label="SESSION" 
            value={filters.session} 
            options={['All', 'May/June', 'Oct/Nov', 'Feb/March']}
            onChange={(val: string) => setFilters(f => ({ ...f, session: val }))}
          />
          <div className="space-y-3">
            <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">COMPLETION DATE</label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input 
                type="date" 
                value={filters.fromDate} 
                onChange={(e) => setFilters(f => ({ ...f, fromDate: e.target.value }))} 
                className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-3 py-3 text-[11px] font-bold text-slate-700 dark:text-slate-200 outline-none transition-colors" 
              />
              <input 
                type="date" 
                value={filters.toDate} 
                onChange={(e) => setFilters(f => ({ ...f, toDate: e.target.value }))} 
                className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-3 py-3 text-[11px] font-bold text-slate-700 dark:text-slate-200 outline-none transition-colors" 
              />
            </div>
          </div>
        </div>
        <div className="mt-6 pt-6 border-t border-slate-50 dark:border-slate-800 flex justify-end">
          <button 
            onClick={handleReset} 
            className="flex items-center gap-2 text-blue-600 dark:text-gold font-black uppercase text-[10px] tracking-widest hover:bg-blue-50 dark:hover:bg-gold/10 px-4 py-2 rounded-lg transition-all"
          >
            <i className="fas fa-rotate-left"></i>
            RESET FILTERS
          </button>
        </div>
      </div>

      {/* History Table */}
      <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
              <th className="px-8 py-5">Paper Details</th>
              <th className="px-6 py-5">Log Date</th>
              <th className="px-6 py-5 text-center">Score</th>
              <th className="px-6 py-5">Weaknesses</th>
              <th className="px-8 py-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
            {filteredHistory.length === 0 ? (
              <tr><td colSpan={5} className="px-8 py-20 text-center text-slate-400 dark:text-slate-500 font-medium italic">No past paper logs found matching these filters.</td></tr>
            ) : (
              filteredHistory.map((entry) => {
                const subject = subjects.find(s => s.id === entry.subjectId);
                const issueCount = (entry.mistakes?.length || 0) + (entry.wrongQuestions?.length || 0);
                
                return (
                  <tr key={entry.paperId} className="hover:bg-slate-50/30 dark:hover:bg-slate-800/30 transition-colors group">
                    <td className="px-8 py-5">
                      <p className="font-black text-slate-800 dark:text-slate-100 text-sm">{entry.component || 'Exam'}</p>
                      <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">{subject?.name || 'Subject'} {entry.year}</p>
                    </td>
                    <td className="px-6 py-5 text-xs font-bold text-slate-500 dark:text-slate-400">
                      {entry.dateCompleted ? new Date(entry.dateCompleted).toLocaleDateString() : '-'}
                    </td>
                    <td className="px-6 py-5 text-center">
                      <span className={`px-3 py-1 rounded-lg text-xs font-black uppercase ${
                        (entry.score || 0) >= 80 ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400' : 
                        (entry.score || 0) >= 60 ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400'
                      }`}>
                        {entry.score}%
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-1.5">
                        {issueCount > 0 ? (
                          <>
                            <span className="w-5 h-5 bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400 rounded-md flex items-center justify-center text-[10px] font-black">{issueCount}</span>
                            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">Flagged</span>
                          </>
                        ) : (
                          <span className="text-[10px] text-slate-300 dark:text-slate-600 italic">Perfect Paper</span>
                        )}
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => setSelectedPaper(entry)}
                          className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 dark:text-slate-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-500 transition-all"
                        >
                          <i className="far fa-eye"></i>
                        </button>
                        <button 
                          onClick={() => onDelete(entry.paperId)} 
                          className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-300 dark:text-slate-600 hover:text-red-500 transition-all"
                        >
                          <i className="far fa-trash-alt"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <PaperDetailModal 
        isOpen={!!selectedPaper}
        onClose={() => setSelectedPaper(null)}
        paper={selectedPaper}
        subject={subjects.find(s => s.id === selectedPaper?.subjectId)}
      />
    </div>
  );
};

const FilterSelect = ({ label, value, options, onChange }: any) => (
  <div className="space-y-3">
    <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{label}</label>
    <div className="relative">
      <select 
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-slate-50 dark:bg-slate-800 border-none text-slate-700 dark:text-slate-200 font-bold rounded-xl px-5 py-3.5 appearance-none focus:ring-4 focus:ring-blue-500/5 cursor-pointer outline-none text-xs transition-colors"
      >
        {options.map((opt: any) => {
          const val = typeof opt === 'string' ? opt : opt.value;
          const lab = typeof opt === 'string' ? opt : opt.label;
          return <option key={val} value={val}>{lab}</option>;
        })}
      </select>
      <i className="fas fa-chevron-down absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 dark:text-slate-500 text-[10px]"></i>
    </div>
  </div>
);

export default History;
