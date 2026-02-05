
import React, { useState, useMemo } from 'react';
import { Subject } from '../types';
import { DailyTaskMap } from '../App';

interface PlannerProps {
  subjects: Subject[];
  dailyTasks: DailyTaskMap;
  onToggleTask: (date: string, subjectId: string) => void;
}

const Planner: React.FC<PlannerProps> = ({ subjects, dailyTasks, onToggleTask }) => {
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);

  const tasksForDay = dailyTasks[selectedDate] || {};
  const completedCount = Object.values(tasksForDay).filter(v => v).length;
  const totalCount = subjects.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const streak = useMemo(() => {
    if (subjects.length === 0) return 0;
    const isFinished = (dateStr: string) => {
      const dayTasks = dailyTasks[dateStr] || {};
      return subjects.every(s => dayTasks[s.id]);
    };

    let count = 0;
    let d = new Date();
    // Start checking from today
    let dateStr = d.toISOString().split('T')[0];
    
    // If today is not finished, check yesterday to see if streak is still alive
    if (!isFinished(dateStr)) {
      d.setDate(d.getDate() - 1);
      dateStr = d.toISOString().split('T')[0];
    }

    while (isFinished(dateStr)) {
      count++;
      d.setDate(d.getDate() - 1);
      dateStr = d.toISOString().split('T')[0];
      if (count > 1000) break; // Safety
    }
    return count;
  }, [dailyTasks, subjects]);

  const last7Days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return d.toISOString().split('T')[0];
  }).reverse();

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-4xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-white dark:bg-slate-900 p-10 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 dark:bg-blue-900/10 rounded-bl-full -mr-10 -mt-10 opacity-50"></div>
        
        <div className="relative w-40 h-40 flex-shrink-0">
          <svg className="w-full h-full -rotate-90">
            <circle cx="80" cy="80" r="70" fill="transparent" stroke="currentColor" strokeWidth="12" className="text-slate-100 dark:text-slate-800" />
            <circle 
              cx="80" cy="80" r="70" fill="transparent" 
              className="text-blue-600 dark:text-blue-400 transition-all duration-1000 ease-out" 
              strokeWidth="12" 
              strokeDasharray={439.8} 
              strokeDashoffset={439.8 - (progressPercent / 100) * 439.8}
              strokeLinecap="round" 
              stroke="currentColor"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-black text-slate-800 dark:text-slate-100">{progressPercent}%</span>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Done</span>
          </div>
        </div>
        
        <div className="text-center md:text-left flex-1">
          <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100 mb-2">Daily Streak</h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium mb-6">Complete one past paper per subject to maintain your <span className="text-orange-500 font-bold">{streak} Day Streak</span>.</p>
          
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {last7Days.map(date => {
              const isActive = selectedDate === date;
              const isDayFinished = subjects.length > 0 && subjects.every(s => dailyTasks[date]?.[s.id]);
              return (
                <button 
                  key={date}
                  onClick={() => setSelectedDate(date)}
                  className={`flex-shrink-0 w-12 h-16 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all border ${
                    isActive 
                      ? 'bg-blue-600 border-blue-600 text-white shadow-lg' 
                      : 'bg-slate-50 dark:bg-slate-800 border-transparent text-slate-400 hover:border-slate-200 dark:hover:border-slate-700'
                  }`}
                >
                  <span className="text-[8px] font-black uppercase tracking-tighter opacity-70">{new Date(date).toLocaleDateString('en-US', { weekday: 'short' })}</span>
                  <span className="text-sm font-black">{new Date(date).getDate()}</span>
                  {isDayFinished && <div className={`w-1 h-1 rounded-full ${isActive ? 'bg-white' : 'bg-emerald-500'}`}></div>}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="px-8 py-5 border-b border-slate-50 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/30">
          <h3 className="font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest text-[10px]">Checklist for {new Date(selectedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</h3>
          {streak > 0 && <span className="px-3 py-1 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 rounded-full text-[10px] font-black uppercase tracking-widest animate-pulse">🔥 {streak} Day Streak</span>}
        </div>
        
        <div className="divide-y divide-slate-50 dark:divide-slate-800">
          {subjects.length === 0 ? (
            <div className="p-20 text-center space-y-4">
              <i className="fas fa-book-open text-3xl text-slate-200"></i>
              <p className="text-slate-400 font-medium italic">No subjects added. Visit "Manage Subjects" to begin.</p>
            </div>
          ) : (
            subjects.map(subject => {
              const isDone = tasksForDay[subject.id] || false;
              return (
                <button 
                  key={subject.id}
                  onClick={() => onToggleTask(selectedDate, subject.id)}
                  className="w-full px-8 py-6 flex items-center justify-between group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors text-left"
                >
                  <div className="flex items-center gap-5">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                      isDone 
                        ? 'bg-emerald-500 text-white' 
                        : 'bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-slate-300 group-hover:border-blue-200 group-hover:text-blue-500'
                    }`}>
                      <i className={`fas ${isDone ? 'fa-check' : 'fa-graduation-cap'}`}></i>
                    </div>
                    <div>
                      <p className={`font-black text-sm transition-all ${isDone ? 'text-slate-400 line-through' : 'text-slate-800 dark:text-slate-100'}`}>
                        {subject.name}
                      </p>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        {isDone ? 'Session Logged' : 'Past Paper Pending'}
                      </p>
                    </div>
                  </div>
                  <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                    isDone 
                      ? 'bg-emerald-500 border-emerald-500 text-white' 
                      : 'border-slate-100 dark:border-slate-700 group-hover:border-blue-400'
                  }`}>
                    {isDone && <i className="fas fa-check text-[10px]"></i>}
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default Planner;
