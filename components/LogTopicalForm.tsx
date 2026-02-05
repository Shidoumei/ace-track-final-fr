
import React, { useState, useEffect } from 'react';
import { Subject, TopicalProgress, Mistake, WrongQuestion } from '../types';
import MistakeModal from './MistakeModal';

const FormGroup = ({ label, children }: { label: string, children?: React.ReactNode }) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">{label}</label>
    {children}
  </div>
);

interface LogTopicalFormProps {
  subjects: Subject[];
  onLog: (progress: TopicalProgress) => void;
}

const LogTopicalForm: React.FC<LogTopicalFormProps> = ({ subjects, onLog }) => {
  const [formData, setFormData] = useState({
    subjectId: '',
    topicName: '',
    chapter: '',
    dateCompleted: new Date().toISOString().split('T')[0],
    mins: '',
    secs: '',
    userMark: '',
    totalMarks: '',
    mistakes: [] as Mistake[]
  });

  const [isMistakeModalOpen, setIsMistakeModalOpen] = useState(false);
  const [percentage, setPercentage] = useState<number | null>(null);

  useEffect(() => {
    const mark = parseFloat(formData.userMark);
    const total = parseFloat(formData.totalMarks);
    if (!isNaN(mark) && !isNaN(total) && total > 0) {
      setPercentage(Math.round((mark / total) * 100));
    } else {
      setPercentage(null);
    }
  }, [formData.userMark, formData.totalMarks]);

  const handleClear = () => {
    setFormData({
      subjectId: '',
      topicName: '',
      chapter: '',
      dateCompleted: new Date().toISOString().split('T')[0],
      mins: '',
      secs: '',
      userMark: '',
      totalMarks: '',
      mistakes: []
    });
  };

  const handleLog = () => {
    if (!formData.subjectId || !formData.topicName) {
      return alert("Please select a subject and enter a topic name.");
    }

    const timeInSeconds = (parseInt(formData.mins || '0') * 60) + parseInt(formData.secs || '0');

    onLog({
      id: Math.random().toString(36).substring(7),
      subjectId: formData.subjectId,
      topicName: formData.topicName,
      chapter: formData.chapter,
      userMark: parseFloat(formData.userMark),
      totalMarks: parseFloat(formData.totalMarks),
      score: percentage || 0,
      timeTaken: timeInSeconds,
      dateCompleted: formData.dateCompleted,
      mistakes: formData.mistakes,
      wrongQuestions: [] // Flagged questions are now integrated into mistakes
    });

    handleClear();
    alert("Topical revision logged successfully!");
  };

  const handleAddMistake = (mistakeData: Omit<Mistake, 'id'>) => {
    const newMistake: Mistake = {
      ...mistakeData,
      id: Math.random().toString(36).substring(7)
    };
    setFormData(prev => ({ ...prev, mistakes: [...prev.mistakes, newMistake] }));
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto animate-in fade-in duration-500">
      <div className="flex-1 space-y-8">
        {/* Topical Details Card */}
        <div className="bg-white dark:bg-slate-900 p-8 md:p-10 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-800 transition-colors">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-blue-50 dark:bg-blue-900/20 w-10 h-10 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400">
              <i className="fas fa-layer-group"></i>
            </div>
            <h3 className="text-xl font-black text-slate-800 dark:text-slate-100 transition-colors">Topical Details</h3>
          </div>

          <div className="space-y-6">
            <FormGroup label="Subject">
              <div className="relative">
                <select 
                  value={formData.subjectId}
                  onChange={(e) => setFormData({...formData, subjectId: e.target.value})}
                  className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-5 py-4 text-slate-700 dark:text-slate-200 font-bold outline-none appearance-none focus:ring-4 focus:ring-blue-500/5 transition-all cursor-pointer"
                >
                  <option value="">Select subject</option>
                  {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
                <i className="fas fa-chevron-down absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-xs"></i>
              </div>
            </FormGroup>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormGroup label="Topic Name">
                <input 
                  type="text" 
                  placeholder="e.g. Differentiation"
                  value={formData.topicName}
                  onChange={(e) => setFormData({...formData, topicName: e.target.value})}
                  className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-5 py-4 text-slate-700 dark:text-slate-200 font-bold outline-none focus:ring-4 focus:ring-blue-500/5 transition-all"
                />
              </FormGroup>
              <FormGroup label="Chapter / Reference">
                <input 
                  type="text" 
                  placeholder="e.g. Chapter 4"
                  value={formData.chapter}
                  onChange={(e) => setFormData({...formData, chapter: e.target.value})}
                  className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-5 py-4 text-slate-700 dark:text-slate-200 font-bold outline-none focus:ring-4 focus:ring-blue-500/5 transition-all"
                />
              </FormGroup>
            </div>
          </div>
        </div>

        {/* Improvement Tracking Card (Merged) */}
        <div className="bg-white dark:bg-slate-900 p-8 md:p-10 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-800 transition-colors">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-red-50 dark:bg-red-900/20 w-10 h-10 rounded-xl flex items-center justify-center text-red-500 dark:text-red-400">
              <i className="fas fa-exclamation-triangle"></i>
            </div>
            <h3 className="text-xl font-black text-slate-800 dark:text-slate-100 transition-colors">Improvement Tracking</h3>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="text-lg font-black text-slate-800 dark:text-slate-100">Mistakes Ledger</h4>
              <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Compulsory Question Details</span>
            </div>

            <div className="space-y-3">
              {formData.mistakes.length === 0 ? (
                <p className="text-xs text-slate-400 dark:text-slate-500 italic px-2">No blunders logged for this session.</p>
              ) : (
                formData.mistakes.map(m => (
                  <div key={m.id} className="p-5 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-800 flex justify-between items-center group transition-all hover:shadow-sm">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex flex-col items-center justify-center text-[10px] font-black bg-red-50 dark:bg-red-900/30 text-red-500 border border-red-100 dark:border-red-900/30`}>
                        <span className="opacity-50 text-[7px]">Q</span>
                        {m.questionNumber}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-700 dark:text-slate-300 leading-tight">{m.description}</p>
                        <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">{m.category}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setFormData(p => ({ ...p, mistakes: p.mistakes.filter(x => x.id !== m.id) }))}
                      className="w-8 h-8 rounded-full flex items-center justify-center text-slate-300 dark:text-slate-600 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100"
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  </div>
                ))
              )}
              <button 
                onClick={() => setIsMistakeModalOpen(true)}
                className="flex items-center gap-2 px-6 py-2.5 rounded-full border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-red-500 hover:text-red-500 dark:hover:text-red-400 transition-all font-black text-[10px] uppercase tracking-widest bg-white dark:bg-slate-900 shadow-sm"
              >
                <i className="fas fa-plus-circle"></i> LOG MISTAKE DETAIL
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-80 space-y-6">
        <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-800 text-center transition-colors">
          <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Percentage</p>
          <p className="text-5xl font-black text-blue-600 dark:text-blue-400 mb-6">{percentage !== null ? `${percentage}%` : '-'}</p>
          <div className="grid grid-cols-2 gap-3 mb-8">
            <div className="space-y-1">
              <input 
                type="text" 
                placeholder="Mark"
                value={formData.userMark}
                onChange={(e) => setFormData({...formData, userMark: e.target.value})}
                className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-3 py-4 text-center font-bold text-slate-700 dark:text-slate-200 outline-none focus:ring-4 focus:ring-blue-500/5 transition-all"
              />
              <p className="text-[8px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-widest">User Mark</p>
            </div>
            <div className="space-y-1">
              <input 
                type="text" 
                placeholder="Total"
                value={formData.totalMarks}
                onChange={(e) => setFormData({...formData, totalMarks: e.target.value})}
                className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-3 py-4 text-center font-bold text-slate-700 dark:text-slate-200 outline-none focus:ring-4 focus:ring-blue-500/5 transition-all"
              />
              <p className="text-[8px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-widest">Out Of</p>
            </div>
          </div>
          
          <FormGroup label="Completion Date">
            <input 
              type="date" 
              value={formData.dateCompleted}
              onChange={(e) => setFormData({...formData, dateCompleted: e.target.value})}
              className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-5 py-4 text-slate-700 dark:text-slate-200 font-bold outline-none focus:ring-4 focus:ring-blue-500/5 transition-all mb-6"
            />
          </FormGroup>

          <button 
            onClick={handleLog}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-5 rounded-[2rem] shadow-xl shadow-blue-500/10 dark:shadow-none transition-all text-lg mb-4 active:scale-95"
          >
            Log Session
          </button>
          <button onClick={handleClear} className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">Clear Form</button>
        </div>
      </div>

      <MistakeModal 
        isOpen={isMistakeModalOpen} 
        onClose={() => setIsMistakeModalOpen(false)} 
        onSave={handleAddMistake}
        paperName={formData.topicName || 'Current Topic'}
      />
    </div>
  );
};

export default LogTopicalForm;
