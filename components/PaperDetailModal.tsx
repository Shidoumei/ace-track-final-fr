
import React from 'react';
import { PaperProgress, Subject } from '../types';

interface PaperDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  paper: PaperProgress | null;
  subject: Subject | undefined;
}

const PaperDetailModal: React.FC<PaperDetailModalProps> = ({ isOpen, onClose, paper, subject }) => {
  if (!isOpen || !paper) return null;

  const circumference = 2 * Math.PI * 35; // r=35
  const percentage = paper.score || 0;
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
            <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100">{paper.component || 'Paper'}</h2>
            <p className="text-slate-400 dark:text-slate-500 font-bold text-sm">
              {subject?.name} ({subject?.code})
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
              <p className="text-[10px] font-black text-blue-400 dark:text-blue-500 uppercase tracking-widest mb-2">Score Achieved</p>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-black text-slate-800 dark:text-slate-100">{paper.userMark}</span>
                <span className="text-xl font-bold text-slate-400 dark:text-slate-500">/ {paper.totalMarks}</span>
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
            <MetaBox icon="fa-calendar" label="Session" value={`${paper.session || '-'} ${paper.year || ''}`} />
            <MetaBox icon="fa-bullseye" label="Variant" value={`Variant ${paper.variant || '-'}`} />
            <MetaBox icon="fa-clock" label="Duration" value={formatDuration(paper.timeTaken)} />
            <MetaBox icon="fa-calendar-check" label="Completed" value={formatDate(paper.dateCompleted)} />
          </div>

          {/* Areas for Improvement */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-red-500 dark:text-red-400">
              <i className="fas fa-exclamation-circle"></i>
              <h3 className="font-black text-sm uppercase tracking-widest">Areas for Improvement</h3>
            </div>
            
            <div className="space-y-3">
              {(!paper.mistakes || paper.mistakes.length === 0) ? (
                <div className="p-10 text-center bg-slate-50 dark:bg-slate-800/50 rounded-[2rem] border border-dashed border-slate-200 dark:border-slate-700">
                  <p className="text-slate-400 dark:text-slate-500 italic text-sm font-medium">No areas for improvement logged. Well done!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {paper.mistakes?.map((m) => (
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

// MetaBox component for consistent display of session, variant, duration, etc.
const MetaBox: React.FC<{ icon: string, label: string, value: string }> = ({ icon, label, value }) => (
  <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 flex items-center gap-3 border border-slate-100 dark:border-slate-800">
    <div className="w-8 h-8 rounded-lg bg-white dark:bg-slate-800 text-blue-500 dark:text-blue-400 flex items-center justify-center text-sm shadow-sm">
      <i className={`fas ${icon}`}></i>
    </div>
    <div>
      <p className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{label}</p>
      <p className="text-xs font-black text-slate-800 dark:text-slate-100 truncate max-w-[120px]">{value}</p>
    </div>
  </div>
);

// ImprovementItem component for displaying flagged questions and mistakes.
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

export default PaperDetailModal;
