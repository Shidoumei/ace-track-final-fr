
import React, { useState } from 'react';
import { Subject, PaperProgress, PaperStatus, Mistake } from '../types';
import { getAIStudyAdvice } from '../services/gemini';
import { calculateGrade, getGradeColor } from '../utils/grades';
import MistakeModal from './MistakeModal';

interface SubjectDetailProps {
  subject: Subject;
  progress: PaperProgress[];
  onUpdateProgress: (progress: PaperProgress) => void;
  onBack: () => void;
}

const SubjectDetail: React.FC<SubjectDetailProps> = ({ subject, progress, onUpdateProgress, onBack }) => {
  const [selectedYear, setSelectedYear] = useState<number | 'All'>('All');
  const [aiAdvice, setAiAdvice] = useState<string>('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isMistakeModalOpen, setIsMistakeModalOpen] = useState(false);
  const [activePaperForMistake, setActivePaperForMistake] = useState<{id: string, name: string} | null>(null);

  const years = Array.from(new Set(subject.papers.map(p => p.year))).sort((a: number, b: number) => b - a);
  const filteredPapers = selectedYear === 'All' 
    ? subject.papers 
    : subject.papers.filter(p => p.year === selectedYear);

  const subjectProgress = progress.filter(p => p.subjectId === subject.id);

  const handleFetchAdvice = async () => {
    setIsAiLoading(true);
    const advice = await getAIStudyAdvice(subject, subjectProgress);
    setAiAdvice(advice);
    setIsAiLoading(false);
  };

  const getProgressForPaper = (paperId: string) => subjectProgress.find(p => p.paperId === paperId);

  const handleAddMistake = (mistakeData: Omit<Mistake, 'id'>) => {
    if (!activePaperForMistake) return;
    
    const paperId = activePaperForMistake.id;
    const current = getProgressForPaper(paperId);
    
    const newMistake: Mistake = {
      ...mistakeData,
      id: Math.random().toString(36).substring(7)
    };

    onUpdateProgress({
      paperId,
      subjectId: subject.id,
      status: current?.status || PaperStatus.IN_PROGRESS,
      ...current,
      mistakes: [...(current?.mistakes || []), newMistake]
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="w-10 h-10 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-blue-600 transition-all flex items-center justify-center shadow-sm">
            <i className="fas fa-arrow-left"></i>
          </button>
          <div>
            <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100">{subject.name}</h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">{subject.examBoard} • {subject.code} • Target: {subject.targetGrade || 'A'}</p>
          </div>
        </div>
        <button 
          onClick={handleFetchAdvice}
          disabled={isAiLoading || subjectProgress.filter(p => p.status === PaperStatus.COMPLETED).length === 0}
          className="bg-blue-600 hover:bg-blue-700 text-white font-black px-6 py-3 rounded-2xl flex items-center gap-3 shadow-lg shadow-blue-100 dark:shadow-none transition-all active:scale-95 disabled:opacity-50 disabled:grayscale"
        >
          {isAiLoading ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-wand-magic-sparkles"></i>}
          Analyze Performance
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 space-y-6">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <button onClick={() => setSelectedYear('All')} className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${selectedYear === 'All' ? 'bg-blue-600 text-white shadow-lg' : 'bg-white dark:bg-slate-900 text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>All Years</button>
            {years.map(y => (
              <button key={y} onClick={() => setSelectedYear(y)} className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${selectedYear === y ? 'bg-blue-600 text-white shadow-lg' : 'bg-white dark:bg-slate-900 text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>{y}</button>
            ))}
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <th className="px-8 py-5">Paper Component</th>
                  <th className="px-6 py-5">Status</th>
                  <th className="px-6 py-5 text-center">Score</th>
                  <th className="px-6 py-5 text-center">Grade</th>
                  <th className="px-6 py-5 text-center">Mistakes</th>
                  <th className="px-8 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                {filteredPapers.length === 0 ? (
                  <tr><td colSpan={6} className="p-20 text-center text-slate-400 font-medium italic">No papers listed for this syllabus yet.</td></tr>
                ) : (
                  filteredPapers.map(paper => {
                    const pData = getProgressForPaper(paper.id);
                    const score = pData?.score;
                    const grade = score !== undefined ? calculateGrade(score) : null;
                    const mistakeCount = pData?.mistakes?.length || 0;
                    
                    return (
                      <tr key={paper.id} className="hover:bg-slate-50/30 dark:hover:bg-slate-800/30 transition-colors group">
                        <td className="px-8 py-5">
                          <p className="font-black text-slate-800 dark:text-slate-200 text-sm">{paper.component} v{paper.variant}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase">{paper.series} {paper.year}</p>
                        </td>
                        <td className="px-6 py-5">
                          <StatusBadge status={pData?.status || PaperStatus.NOT_STARTED} />
                        </td>
                        <td className="px-6 py-5 text-center">
                          <span className="text-sm font-black text-slate-700 dark:text-slate-300">{score !== undefined ? `${score}%` : '-'}</span>
                        </td>
                        <td className="px-6 py-5 text-center">
                          {grade ? (
                            <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${getGradeColor(grade)}`}>
                              {grade}
                            </span>
                          ) : '-'}
                        </td>
                        <td className="px-6 py-5 text-center">
                          {mistakeCount > 0 ? (
                            <span className="bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400 w-6 h-6 rounded-full inline-flex items-center justify-center text-[10px] font-black">{mistakeCount}</span>
                          ) : <span className="text-slate-300 dark:text-slate-700">-</span>}
                        </td>
                        <td className="px-8 py-5 text-right">
                          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                              onClick={() => {
                                setActivePaperForMistake({ id: paper.id, name: `${paper.year} ${paper.series} ${paper.component}` });
                                setIsMistakeModalOpen(true);
                              }}
                              className="w-9 h-9 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 transition-all"
                              title="Log mistake"
                            >
                              <i className="fas fa-exclamation-circle"></i>
                            </button>
                            <button 
                              onClick={() => {
                                const nextStatus = pData?.status === PaperStatus.COMPLETED ? PaperStatus.NOT_STARTED : pData?.status === PaperStatus.IN_PROGRESS ? PaperStatus.COMPLETED : PaperStatus.IN_PROGRESS;
                                onUpdateProgress({
                                  paperId: paper.id,
                                  subjectId: subject.id,
                                  status: nextStatus,
                                  score: nextStatus === PaperStatus.COMPLETED ? Math.floor(Math.random() * 40 + 60) : undefined,
                                  dateCompleted: nextStatus === PaperStatus.COMPLETED ? new Date().toISOString() : undefined,
                                  mistakes: pData?.mistakes || [],
                                  year: paper.year,
                                  session: paper.series,
                                  variant: paper.variant,
                                  component: paper.component
                                });
                              }}
                              className="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-600 hover:text-white transition-all"
                            >
                              {pData?.status === PaperStatus.COMPLETED ? 'Reset' : 'Update'}
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
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 p-8 shadow-sm">
            <h4 className="font-black text-slate-800 dark:text-slate-100 uppercase tracking-widest text-xs mb-6 flex items-center justify-between">
              AI Tutor Insights
              <i className="fas fa-brain text-blue-400"></i>
            </h4>
            {aiAdvice ? (
              <div className="space-y-4">
                <div className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed bg-slate-50 dark:bg-slate-800/50 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 whitespace-pre-wrap italic shadow-inner">
                  "{aiAdvice}"
                </div>
                <button onClick={handleFetchAdvice} className="text-[10px] font-black text-blue-500 uppercase tracking-widest hover:underline w-full text-center">Update Analysis</button>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-xs text-slate-400 font-medium mb-6">Complete at least one paper to receive specific study strategies.</p>
                <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/10 rounded-full flex items-center justify-center text-blue-300 dark:text-blue-700 text-xl mx-auto mb-6">
                  <i className="fas fa-lightbulb"></i>
                </div>
                <button 
                  onClick={handleFetchAdvice}
                  disabled={subjectProgress.filter(p => p.status === PaperStatus.COMPLETED).length === 0}
                  className="text-[10px] font-black text-blue-500 uppercase tracking-widest hover:underline disabled:opacity-30"
                >
                  Request Analysis
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <MistakeModal 
        isOpen={isMistakeModalOpen} 
        onClose={() => setIsMistakeModalOpen(false)} 
        onSave={handleAddMistake}
        paperName={activePaperForMistake?.name || ''}
      />
    </div>
  );
};

const StatusBadge = ({ status }: { status: PaperStatus }) => {
  const styles = { 
    [PaperStatus.NOT_STARTED]: 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500', 
    [PaperStatus.IN_PROGRESS]: 'bg-amber-50 dark:bg-amber-900/20 text-amber-500 dark:text-amber-400', 
    [PaperStatus.COMPLETED]: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500 dark:text-emerald-400' 
  };
  return <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${styles[status]}`}>{status}</span>;
};

export default SubjectDetail;
