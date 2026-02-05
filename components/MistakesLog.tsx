
import React from 'react';
import { PaperProgress, Subject, MistakeCategory } from '../types';

interface MistakesLogProps {
  subjects: Subject[];
  progress: PaperProgress[];
}

const MistakesLog: React.FC<MistakesLogProps> = ({ subjects, progress }) => {
  const allEntries = progress.flatMap(p => {
    const subject = subjects.find(s => s.id === p.subjectId);
    return (p.mistakes || []).map(m => ({
      ...m,
      subjectName: subject?.name || 'Unknown',
      paperId: p.paperId,
      date: p.dateCompleted
    }));
  }).sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime());

  const categoryCounts = allEntries.reduce((acc: Record<string, number>, curr) => {
    acc[curr.category] = (acc[curr.category] || 0) + 1;
    return acc;
  }, {});

  const categoryColors: Record<MistakeCategory, string> = {
    'Silly Error': 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400',
    'Conceptual Gap': 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
    'Time Management': 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
    'Misread Question': 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400',
    'Other': 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-400'
  };

  if (allEntries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 bg-white dark:bg-slate-900 rounded-[3rem] border border-dashed border-slate-300 dark:border-slate-800 transition-colors">
        <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-[2rem] flex items-center justify-center text-slate-300 dark:text-slate-600 text-3xl mb-6">
          <i className="fas fa-search-minus"></i>
        </div>
        <h3 className="text-xl font-black text-slate-800 dark:text-slate-100">No mistakes logged yet</h3>
        <p className="text-slate-500 dark:text-slate-400 text-sm max-w-xs text-center font-medium mt-2 leading-relaxed">Log papers as completed to see improvement patterns here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Object.entries(categoryCounts).map(([cat, count]) => (
          <div key={cat} className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm transition-colors">
            <span className={`px-3 py-1 rounded-xl text-[9px] font-black uppercase tracking-widest ${categoryColors[cat as MistakeCategory]}`}>
              {cat}
            </span>
            <p className="text-4xl font-black mt-4 text-slate-800 dark:text-slate-100">{count}</p>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-widest mt-1">Total Occurrences</p>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
        <div className="px-8 py-6 border-b border-slate-50 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
          <h3 className="text-sm font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Mistake Ledger</h3>
        </div>
        <div className="divide-y divide-slate-50 dark:divide-slate-800">
          {allEntries.map((m) => (
            <div key={m.id} className="p-8 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-all group">
              <div className="flex flex-wrap items-start justify-between gap-6">
                <div className="space-y-3 flex-1">
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-xl text-[9px] font-black uppercase tracking-widest ${categoryColors[m.category]}`}>
                      {m.category}
                    </span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-widest">
                      {m.date ? new Date(m.date).toLocaleDateString() : 'Recent Session'}
                    </span>
                  </div>
                  <p className="text-slate-800 dark:text-slate-200 font-bold leading-relaxed">{m.description}</p>
                  <div className="flex items-center gap-2.5 text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest">
                    <i className="fas fa-book text-[9px]"></i>
                    {m.subjectName} <span className="text-slate-300 dark:text-slate-700">•</span> {m.paperId.split('-').slice(1).join(' ')}
                  </div>
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                   <button className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 hover:text-blue-500 dark:hover:text-blue-400 tracking-widest">
                     View Detail <i className="fas fa-chevron-right ml-1"></i>
                   </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MistakesLog;
