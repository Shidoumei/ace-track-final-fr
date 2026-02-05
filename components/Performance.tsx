
import React, { useState, useMemo } from 'react';
import { Subject, PaperProgress, PaperStatus, Grade, TopicalProgress } from '../types';
import { calculateGrade, getGradeColor } from '../utils/grades';
import PaperDetailModal from './PaperDetailModal';
import TopicalDetailModal from './TopicalDetailModal';

interface PerformanceProps {
  subjects: Subject[];
  progress: PaperProgress[];
  topicalProgress: TopicalProgress[];
}

const Performance: React.FC<PerformanceProps> = ({ subjects, progress, topicalProgress }) => {
  const [view, setView] = useState<'selection' | 'yearly' | 'topical'>('selection');
  const [selectedPaper, setSelectedPaper] = useState<PaperProgress | null>(null);
  const [selectedTopical, setSelectedTopical] = useState<TopicalProgress | null>(null);
  
  const [filters, setFilters] = useState({
    subject: 'All',
    paperType: 'All',
    session: 'All'
  });

  const handleReset = () => {
    setFilters({ subject: 'All', paperType: 'All', session: 'All' });
  };

  const filteredYearly = useMemo(() => {
    return progress.filter(p => {
      if (filters.subject !== 'All' && p.subjectId !== filters.subject) return false;
      if (filters.paperType !== 'All' && p.component !== filters.paperType) return false;
      if (filters.session !== 'All' && p.session !== filters.session) return false;

      return p.status === PaperStatus.COMPLETED;
    }).sort((a, b) => new Date(b.dateCompleted || 0).getTime() - new Date(a.dateCompleted || 0).getTime());
  }, [progress, filters]);

  const componentStats = useMemo(() => {
    const stats: Record<string, {
      scores: number[],
      times: number[],
      best: number,
      lowest: number
    }> = {};

    filteredYearly.forEach(p => {
      const pType = p.component || 'Unknown';
      
      if (!stats[pType]) {
        stats[pType] = { scores: [], times: [], best: 0, lowest: 100 };
      }

      if (p.score !== undefined) {
        stats[pType].scores.push(p.score);
        stats[pType].best = Math.max(stats[pType].best, p.score);
        stats[pType].lowest = Math.min(stats[pType].lowest, p.score);
      }

      if (p.timeTaken !== undefined) {
        stats[pType].times.push(p.timeTaken);
      }
    });

    return stats;
  }, [filteredYearly]);

  const filteredTopical = useMemo(() => {
    if (filters.subject === 'All') return topicalProgress;
    return topicalProgress.filter(p => p.subjectId === filters.subject);
  }, [topicalProgress, filters.subject]);

  if (view === 'selection') {
    return (
      <div className="py-10 animate-in fade-in zoom-in-95 duration-500">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-black text-slate-800 dark:text-slate-100">Select Analysis Mode</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">How would you like to evaluate your progress today?</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <button 
            onClick={() => setView('yearly')}
            className="group relative bg-white dark:bg-slate-900 p-10 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none hover:shadow-blue-500/10 hover:border-blue-200 dark:hover:border-blue-700 transition-all text-left overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 dark:bg-blue-900/10 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-110"></div>
            <div className="w-16 h-16 bg-blue-600 rounded-3xl flex items-center justify-center text-white text-2xl mb-8 shadow-lg shadow-blue-200 dark:shadow-none relative z-10">
              <i className="fas fa-calendar-alt"></i>
            </div>
            <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100 mb-3 relative z-10">Yearly Analysis</h3>
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed mb-6 relative z-10">Track performance across exam sessions, paper variants, and components. Identify trends in your grades over the years.</p>
            <span className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 font-black text-sm uppercase tracking-widest group-hover:gap-4 transition-all">
              Explore History <i className="fas fa-arrow-right"></i>
            </span>
          </button>

          <button 
            onClick={() => setView('topical')}
            className="group relative bg-white dark:bg-slate-900 p-10 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none hover:shadow-indigo-500/10 hover:border-indigo-200 dark:hover:border-indigo-700 transition-all text-left overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 dark:bg-indigo-900/10 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-110"></div>
            <div className="w-16 h-16 bg-indigo-600 rounded-3xl flex items-center justify-center text-white text-2xl mb-8 shadow-lg shadow-indigo-200 dark:shadow-none relative z-10">
              <i className="fas fa-layer-group"></i>
            </div>
            <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100 mb-3 relative z-10">Topical Analysis</h3>
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed mb-6 relative z-10">Drill down into specific chapters and syllabus topics. See exactly which areas are causing conceptual gaps.</p>
            <span className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-black text-sm uppercase tracking-widest group-hover:gap-4 transition-all">
              Check Topics <i className="fas fa-arrow-right"></i>
            </span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="flex justify-between items-center">
        <button 
          onClick={() => { setView('selection'); handleReset(); }}
          className="flex items-center gap-2 text-slate-400 dark:text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 font-black text-xs uppercase tracking-widest transition-colors"
        >
          <i className="fas fa-arrow-left"></i> Back to Selection
        </button>
        <h3 className="text-xl font-black text-slate-800 dark:text-slate-100">
          {view === 'yearly' ? 'Yearly Performance Ledger' : 'Topical Mastery Overview'}
        </h3>
      </div>

      {/* Filter Bar */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-800 flex flex-wrap items-end gap-6 transition-colors">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">Subject Selection</label>
          <select 
            value={filters.subject} 
            onChange={(e) => setFilters(f => ({ ...f, subject: e.target.value }))}
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-5 py-3.5 font-bold text-slate-700 dark:text-slate-200 outline-none transition-colors"
          >
            <option value="All">All Subjects</option>
            {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>
        
        {view === 'yearly' && (
          <>
            <div className="flex-1 min-w-[150px]">
              <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">Component</label>
              <select 
                value={filters.paperType} 
                onChange={(e) => setFilters(f => ({ ...f, paperType: e.target.value }))}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-5 py-3.5 font-bold text-slate-700 dark:text-slate-200 outline-none transition-colors"
              >
                <option value="All">All Components</option>
                {['P1', 'P2', 'P3', 'P4'].map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div className="flex-1 min-w-[150px]">
              <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">Session</label>
              <select 
                value={filters.session} 
                onChange={(e) => setFilters(f => ({ ...f, session: e.target.value }))}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-5 py-3.5 font-bold text-slate-700 dark:text-slate-200 outline-none transition-colors"
              >
                <option value="All">All Sessions</option>
                {['May/June', 'Oct/Nov', 'Feb/March'].map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </>
        )}
        
        <button onClick={handleReset} className="px-6 py-4 text-xs font-black uppercase text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-2xl transition-all">
          Clear Filters
        </button>
      </div>

      {/* Results Table */}
      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
              <th className="px-8 py-5">{view === 'yearly' ? 'Paper Detail' : 'Topic Detail'}</th>
              <th className="px-6 py-5 text-center">Score</th>
              <th className="px-6 py-5 text-center">{view === 'yearly' ? 'Grade' : 'Efficiency'}</th>
              <th className="px-8 py-5">Identified Weaknesses</th>
              <th className="px-8 py-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
            {view === 'yearly' ? (
              filteredYearly.length === 0 ? (
                <tr><td colSpan={5} className="p-20 text-center text-slate-400 dark:text-slate-500 font-medium italic">No past papers found matching your criteria.</td></tr>
              ) : (
                filteredYearly.map(p => {
                  const subject = subjects.find(s => s.id === p.subjectId);
                  const grade = p.score !== undefined ? calculateGrade(p.score) : 'U';
                  const hasMistakes = p.mistakes && p.mistakes.length > 0;
                  
                  return (
                    <tr key={p.paperId} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors group">
                      <td className="px-8 py-6">
                        <p className="font-black text-slate-800 dark:text-slate-100">{subject?.name}</p>
                        <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-tighter">
                          {p.year} {p.session} • {p.component} v{p.variant}
                        </p>
                      </td>
                      <td className="px-6 py-6 text-center">
                        <span className="text-xl font-black text-slate-700 dark:text-slate-200">{p.score}%</span>
                        <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold mt-1 uppercase">{p.userMark}/{p.totalMarks}</p>
                      </td>
                      <td className="px-6 py-6 text-center">
                        <span className={`px-4 py-1.5 rounded-xl text-xs font-black uppercase tracking-widest ${getGradeColor(grade)}`}>
                          {grade}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        {!hasMistakes ? (
                          <span className="text-xs text-slate-300 dark:text-slate-600 font-medium italic">No weaknesses logged. Perfect run!</span>
                        ) : (
                          <div className="space-y-4">
                            <div>
                              <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-2">Question Details</p>
                              <div className="space-y-2">
                                {p.mistakes?.map(m => (
                                  <div key={m.id} className="flex items-start gap-2 group">
                                    <span className={`px-1.5 py-0.5 rounded text-[8px] font-black flex-shrink-0 bg-red-50 dark:bg-red-900/20 text-red-500`}>Q{m.questionNumber}</span>
                                    <div>
                                      <p className="text-xs font-bold text-slate-700 dark:text-slate-300 leading-tight">{m.description}</p>
                                      <p className="text-[9px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-widest">{m.category}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </td>
                      <td className="px-8 py-6 text-right">
                        <button 
                          onClick={() => setSelectedPaper(p)}
                          className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-400 dark:text-slate-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-500 dark:hover:text-blue-400 transition-all opacity-0 group-hover:opacity-100"
                          title="View Paper Details"
                        >
                          <i className="far fa-eye text-lg"></i>
                        </button>
                      </td>
                    </tr>
                  )
                })
              )
            ) : (
              filteredTopical.length === 0 ? (
                <tr><td colSpan={5} className="p-20 text-center text-slate-400 dark:text-slate-500 font-medium italic">No topical revision entries logged.</td></tr>
              ) : (
                filteredTopical.map(p => {
                  const subject = subjects.find(s => s.id === p.subjectId);
                  const efficiency = p.score && p.score > 80 ? 'Mastered' : p.score && p.score > 60 ? 'Developing' : 'Needs Review';
                  
                  return (
                    <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors group">
                      <td className="px-8 py-6">
                        <p className="font-black text-slate-800 dark:text-slate-100">{p.topicName}</p>
                        <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-tighter">
                          {subject?.name} • {p.chapter}
                        </p>
                      </td>
                      <td className="px-6 py-6 text-center">
                        <span className="text-xl font-black text-slate-700 dark:text-slate-200">{p.score}%</span>
                        <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold mt-1 uppercase">{p.userMark}/{p.totalMarks}</p>
                      </td>
                      <td className="px-6 py-6 text-center">
                        <span className={`px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest ${
                          efficiency === 'Mastered' ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400' :
                          efficiency === 'Developing' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'
                        }`}>
                          {efficiency}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        {p.mistakes && p.mistakes.length > 0 ? (
                          <div className="space-y-2">
                            {p.mistakes.map(m => (
                              <div key={m.id} className="flex items-start gap-2">
                                <span className={`px-1.5 py-0.5 rounded text-[8px] font-black flex-shrink-0 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-500`}>Q{m.questionNumber}</span>
                                <div>
                                  <p className="text-xs font-bold text-slate-700 dark:text-slate-300">{m.description}</p>
                                  <p className="text-[10px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-widest">{m.category}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <span className="text-xs text-slate-300 dark:text-slate-600 font-medium italic">No topical issues noted.</span>
                        )}
                      </td>
                      <td className="px-8 py-6 text-right">
                        <button 
                          onClick={() => setSelectedTopical(p)}
                          className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-400 dark:text-slate-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all opacity-0 group-hover:opacity-100"
                          title="View Topic Details"
                        >
                          <i className="far fa-eye text-lg"></i>
                        </button>
                      </td>
                    </tr>
                  )
                })
              )
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

      <TopicalDetailModal 
        isOpen={!!selectedTopical}
        onClose={() => setSelectedTopical(null)}
        topical={selectedTopical}
        subject={subjects.find(s => s.id === selectedTopical?.subjectId)}
      />
    </div>
  );
};

export default Performance;
