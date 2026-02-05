
import React from 'react';
import { TopicalProgress, Subject } from '../types';

interface TopicalDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  topical: TopicalProgress | null;
  subject: Subject | undefined;
}

const TopicalDetailModal: React.FC<TopicalDetailModalProps> = ({ isOpen, onClose, topical, subject }) => {
  if (!isOpen || !topical) return null;

  const circumference = 2 * Math.PI * 35; // r=35
  const percentage = topical.score || 0;
  const offset = circumference - (percentage / 100) * circumference;

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatDuration = (seconds?: number) => {
    if (seconds === undefined || seconds === 0) return 'Not recorded';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100 dark:border-slate-800 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-8 pb-4 flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100">{topical.topicName}</h2>
            <p className="text-slate-400 dark:text-slate-500 font-bold text-sm">
              {subject?.name} • {topical.chapter || 'Topical Revision'}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-full flex items-center justify-center text-slate-300 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
          >
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 pt-0 space-y-6">
          {/* Score Card */}
          <div className="bg-blue-50/40 dark:bg-blue-900/10 rounded-[2rem] p-8 flex items-center justify-between border border-blue-50 dark:border-blue-900/20">
            <div>
              <p className="text-[10px] font-black text-blue-400 dark:text-blue-500 uppercase tracking-widest mb-2">Topic Score</p>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-black text-slate-800 dark:text-slate-100">{topical.userMark || 0}</span>
                <span className="text-xl font-bold text-slate-400 dark:text-slate-500">/ {topical.totalMarks || 0}</span>
              </div>
            </div>
            
            <div className="relative w-24 h-24">
              <svg className="w-full h-full -rotate-90">
                <circle cx="48" cy="48" r="35" fill="transparent" stroke="currentColor" strokeWidth="8" className="text-slate-200 dark:text-slate-800" />
                <circle 
                  cx="48" cy="48" r="35" fill="transparent" 
                  className="text-emerald-400 transition-all duration-1000 ease-out" 
                  strokeWidth="8" 
                  strokeDasharray={circumference} 
                  strokeDashoffset={offset}
                  strokeLinecap="round" 
                  stroke="currentColor"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-black text-emerald-500 dark:text-emerald-400">{percentage}%</span>
              </div>
            </div>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 gap-4">
            <MetaBox icon="fa-book-open" label="Chapter" value={topical.chapter || '-'} />
            <MetaBox icon="fa-clock" label="Time Spent" value={formatDuration(topical.timeTaken)} />
            <MetaBox icon="fa-calendar-check" label="Date Completed" value={formatDate(topical.dateCompleted)} />
            <MetaBox icon="fa-graduation-cap" label="Efficiency" value={percentage > 80 ? 'Mastered' : percentage > 50 ? 'Developing' : 'Review Needed'} />
          </div>

          {/* Areas for Improvement */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-red-500 dark:text-red-400">
              <i className="fas fa-exclamation-circle"></i>
              <h3 className="font-black text-sm uppercase tracking-widest">Areas for Improvement</h3>
            </div>
            
            <div className="space-y-3 pb-4">
              {(!topical.mistakes || topical.mistakes.length === 0) ? (
                <div className="p-10 text-center bg-slate-50 dark:bg-slate-800/50 rounded-[2rem] border border-dashed border-slate-200 dark:border-slate-700">
                  <p className="text-slate-400 dark:text-slate-500 italic text-sm font-medium">No areas for improvement logged. Topic mastered!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {topical.mistakes?.map((m) => (
                    <ImprovementItem 
                      key={m.id} 
                      qNumber={m.questionNumber} 
                      label={m.description} 
                      subLabel={m.category}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const MetaBox: React.FC<{ icon: string, label: string, value: string }> = ({ icon, label, value }) => (
  <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 flex items-center gap-3 border border-slate-100 dark:border-slate-800">
    <div className="w-8 h-8 rounded-lg bg-white dark:bg-slate-800 text-blue-500 dark:text-blue-400 flex items-center justify-center text-sm shadow-sm">
      <i className={`fas ${icon}`}></i>
    </div>
    <div className="min-w-0">
      <p className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{label}</p>
      <p className="text-xs font-black text-slate-800 dark:text-slate-100 truncate">{value}</p>
    </div>
  </div>
);

const ImprovementItem: React.FC<{ qNumber: string, label: string, subLabel?: string }> = ({ qNumber, label, subLabel }) => (
  <div className="flex items-center gap-4 bg-[#F8FAFC] dark:bg-slate-800/30 p-5 rounded-[1.5rem] border border-slate-100 dark:border-slate-800 transition-all hover:bg-white dark:hover:bg-slate-800 hover:shadow-sm">
    <div className="w-10 h-10 rounded-full bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400 flex items-center justify-center text-xs font-black flex-shrink-0">
      {qNumber}
    </div>
    <div className="flex-1">
      <p className="text-sm font-bold text-slate-700 dark:text-slate-200">{label}</p>
      {subLabel && <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-0.5">{subLabel}</p>}
    </div>
  </div>
);

export default TopicalDetailModal;
