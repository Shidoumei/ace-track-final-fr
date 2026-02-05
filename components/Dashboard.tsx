
import React, { useMemo } from 'react';
import { Subject, PaperProgress, PaperStatus } from '../types';
import { calculateGrade, getGradeColor } from '../utils/grades';

interface DashboardProps {
  subjects: Subject[];
  progress: PaperProgress[];
  onSelectSubject: (id: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ subjects, progress, onSelectSubject }) => {
  const completed = progress.filter(p => p.status === PaperStatus.COMPLETED).length;
  const inProgress = progress.filter(p => p.status === PaperStatus.IN_PROGRESS).length;
  
  const avgScore = useMemo(() => {
    const completedPapers = progress.filter(p => p.status === PaperStatus.COMPLETED && p.score !== undefined);
    if (completedPapers.length === 0) return 0;
    const total = completedPapers.reduce((acc, curr) => acc + (curr.score || 0), 0);
    return Math.round(total / completedPapers.length);
  }, [progress]);

  const currentGrade = calculateGrade(avgScore);

  return (
    <div className="space-y-8">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Completed" value={completed} icon="fa-check-circle" color="text-green-600" />
        <StatCard title="In Progress" value={inProgress} icon="fa-spinner" color="text-amber-500" />
        <StatCard 
          title="Avg Score" 
          value={`${avgScore}%`} 
          icon="fa-bullseye" 
          color="text-indigo-600" 
          subValue={`Grade ${currentGrade}`}
        />
        <StatCard title="Subjects" value={subjects.length} icon="fa-book" color="text-slate-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Subject Progress */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold">Your Subjects</h3>
          </div>
          
          <div className="space-y-4">
            {subjects.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-slate-400">No subjects added yet.</p>
              </div>
            ) : (
              subjects.map(subject => {
                const subjectProgress = progress.filter(p => p.subjectId === subject.id && p.status === PaperStatus.COMPLETED).length;
                // Total papers is difficult to estimate if papers list is empty (new subject), default to 10 for visual
                const totalPapers = subject.papers.length || 10;
                const percentage = Math.round((subjectProgress / totalPapers) * 100) || 0;
                
                return (
                  <div 
                    key={subject.id} 
                    className="p-4 rounded-xl border border-slate-100 hover:border-indigo-200 transition-all cursor-pointer group"
                    onClick={() => onSelectSubject(subject.id)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-bold group-hover:text-indigo-600 transition-colors">{subject.name}</h4>
                        <p className="text-xs text-slate-500">{subject.code} • Target: {subject.targetGrade || 'A'}</p>
                      </div>
                      <span className="text-sm font-bold text-slate-700">{percentage}% Syllabus Done</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-indigo-500 h-full transition-all duration-500" 
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* AI Insight Sidebar */}
        <div className="bg-indigo-900 rounded-2xl shadow-xl p-6 text-white relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <i className="fas fa-robot text-indigo-300"></i>
              <h3 className="font-bold">AI Study Guide</h3>
            </div>
            <p className="text-indigo-100 text-sm leading-relaxed mb-6">
              {completed > 0 
                ? "I've analyzed your recent papers. Click 'Analyze Performance' in a subject view to get specific topic recommendations based on your mistakes."
                : "Log your first past paper to unlock personalized AI revision strategies based on your specific mistake patterns."}
            </p>
            <button className="w-full bg-white text-indigo-900 py-3 rounded-xl font-bold hover:bg-indigo-50 transition-colors text-sm">
              Review Mistakes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, color, subValue }: { title: string, value: string | number, icon: string, color: string, subValue?: string }) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
    <div className="flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-xl ${color}`}>
        <i className={`fas ${icon}`}></i>
      </div>
      <div>
        <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">{title}</p>
        <p className="text-2xl font-black text-slate-800">{value}</p>
        {subValue && <p className="text-[10px] font-black text-indigo-500 mt-1 uppercase">{subValue}</p>}
      </div>
    </div>
  </div>
);

export default Dashboard;
