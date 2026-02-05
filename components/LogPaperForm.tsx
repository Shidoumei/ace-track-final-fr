
import React, { useState, useEffect } from 'react';
import { Subject, PaperProgress, PaperStatus, WrongQuestion, Mistake, MistakeCategory } from '../types';
import MistakeModal from './MistakeModal';

const FormGroup = ({ label, children }: { label: string, children?: React.ReactNode }) => (
  <div className="space-y-2">
    <label className="text-sm font-bold text-slate-800 dark:text-slate-200 block">{label}</label>
    {children}
  </div>
);

interface LogPaperFormProps {
  subjects: Subject[];
  onLog: (progress: PaperProgress) => void;
}

const LogPaperForm: React.FC<LogPaperFormProps> = ({ subjects, onLog }) => {
  const [formData, setFormData] = useState({
    subjectId: '',
    paperType: '',
    customPaperType: '',
    year: '',
    customYear: '',
    session: '',
    customSession: '',
    variant: '',
    customVariant: '',
    dateCompleted: new Date().toISOString().split('T')[0],
    mins: '',
    secs: '',
    userMark: '',
    totalMarks: '',
    mistakes: [] as Mistake[]
  });

  const [percentage, setPercentage] = useState<number | null>(null);
  const [isMistakeModalOpen, setIsMistakeModalOpen] = useState(false);

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
      paperType: '',
      customPaperType: '',
      year: '',
      customYear: '',
      session: '',
      customSession: '',
      variant: '',
      customVariant: '',
      dateCompleted: new Date().toISOString().split('T')[0],
      mins: '',
      secs: '',
      userMark: '',
      totalMarks: '',
      mistakes: []
    });
  };

  const handleAddMistake = (mistakeData: Omit<Mistake, 'id'>) => {
    const newMistake: Mistake = {
      ...mistakeData,
      id: Math.random().toString(36).substring(7)
    };
    setFormData(prev => ({ ...prev, mistakes: [...prev.mistakes, newMistake] }));
  };

  const handleLog = () => {
    if (!formData.subjectId) return alert("Please select a subject");
    if (!formData.userMark || !formData.totalMarks) return alert("Please enter marks");
    
    const finalYear = parseInt(formData.year === 'Custom' ? formData.customYear : formData.year);
    const finalSession = formData.session === 'Custom' ? formData.customSession : formData.session;
    const finalVariant = parseInt(formData.variant === 'Custom' ? formData.customVariant : formData.variant);
    const finalType = formData.paperType === 'Custom' ? formData.customPaperType : formData.paperType;

    const paperId = `manual-${formData.subjectId}-${Date.now()}`;
    const timeInSeconds = (parseInt(formData.mins || '0') * 60) + parseInt(formData.secs || '0');

    onLog({
      paperId,
      subjectId: formData.subjectId,
      status: PaperStatus.COMPLETED,
      userMark: parseFloat(formData.userMark),
      totalMarks: parseFloat(formData.totalMarks),
      score: percentage || 0,
      timeTaken: timeInSeconds,
      dateCompleted: formData.dateCompleted,
      mistakes: formData.mistakes,
      year: isNaN(finalYear) ? undefined : finalYear,
      session: finalSession || 'Log Session',
      variant: isNaN(finalVariant) ? undefined : finalVariant,
      component: finalType || 'Exam'
    });

    handleClear();
    alert("Past paper session saved to history.");
  };

  return (
    <div className="flex flex-col lg:grid lg:grid-cols-12 gap-8 max-w-7xl mx-auto animate-in fade-in duration-500">
      <div className="lg:col-span-8 space-y-8">
        {/* Session Details Card */}
        <div className="bg-white dark:bg-slate-900 p-8 md:p-10 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-800 relative transition-colors">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-blue-50 dark:bg-blue-900/20 w-10 h-10 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400">
              <i className="far fa-file-alt text-lg"></i>
            </div>
            <h3 className="text-xl font-black text-slate-800 dark:text-slate-100">Session Details</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <FormGroup label="Subject">
              <div className="relative">
                <select 
                  value={formData.subjectId}
                  onChange={(e) => setFormData({...formData, subjectId: e.target.value})}
                  className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-5 py-4 text-slate-700 dark:text-slate-200 font-bold outline-none appearance-none cursor-pointer focus:ring-4 focus:ring-blue-500/5 transition-all"
                >
                  <option value="">Select subject</option>
                  {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
                <i className="fas fa-chevron-down absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-xs"></i>
              </div>
            </FormGroup>
            <FormGroup label="Paper Component">
              <div className="relative">
                {formData.paperType === 'Custom' ? (
                  <input 
                    type="text"
                    placeholder="Enter type (e.g. Mock 1)"
                    value={formData.customPaperType}
                    onChange={(e) => setFormData({...formData, customPaperType: e.target.value})}
                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-5 py-4 text-slate-700 dark:text-slate-200 font-bold outline-none"
                    autoFocus
                  />
                ) : (
                  <select 
                    value={formData.paperType}
                    onChange={(e) => setFormData({...formData, paperType: e.target.value})}
                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-5 py-4 text-slate-700 dark:text-slate-200 font-bold outline-none appearance-none cursor-pointer"
                  >
                    <option value="">Select paper component</option>
                    <option value="P1">Paper 1</option>
                    <option value="P2">Paper 2</option>
                    <option value="P3">Paper 3</option>
                    <option value="P4">Paper 4</option>
                    <option value="Custom">Manual Entry...</option>
                  </select>
                )}
                {formData.paperType !== 'Custom' && <i className="fas fa-chevron-down absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-xs"></i>}
              </div>
            </FormGroup>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormGroup label="Exam Year">
              <div className="relative">
                {formData.year === 'Custom' ? (
                  <input 
                    type="text" 
                    placeholder="Year"
                    value={formData.customYear}
                    onChange={(e) => setFormData({...formData, customYear: e.target.value})}
                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-5 py-4 text-slate-700 dark:text-slate-200 font-bold outline-none"
                    autoFocus
                  />
                ) : (
                  <select 
                    value={formData.year}
                    onChange={(e) => setFormData({...formData, year: e.target.value})}
                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-5 py-4 text-slate-700 dark:text-slate-200 font-bold outline-none appearance-none cursor-pointer"
                  >
                    <option value="">Select year</option>
                    {[2026, 2025, 2024, 2023, 2022, 2021, 2020].map(y => <option key={y} value={y}>{y}</option>)}
                    <option value="Custom">Other...</option>
                  </select>
                )}
                {formData.year !== 'Custom' && <i className="fas fa-chevron-down absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-xs"></i>}
              </div>
            </FormGroup>
            <FormGroup label="Exam Session">
              <div className="relative">
                {formData.session === 'Custom' ? (
                  <input 
                    type="text" 
                    placeholder="Session name"
                    value={formData.customSession}
                    onChange={(e) => setFormData({...formData, customSession: e.target.value})}
                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-5 py-4 text-slate-700 dark:text-slate-200 font-bold outline-none"
                  />
                ) : (
                  <select 
                    value={formData.session}
                    onChange={(e) => setFormData({...formData, session: e.target.value})}
                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-5 py-4 text-slate-700 dark:text-slate-200 font-bold outline-none appearance-none cursor-pointer"
                  >
                    <option value="">Select session</option>
                    <option value="May/June">May/June</option>
                    <option value="Oct/Nov">Oct/Nov</option>
                    <option value="Feb/March">Feb/March</option>
                    <option value="Custom">Other...</option>
                  </select>
                )}
                {formData.session !== 'Custom' && <i className="fas fa-chevron-down absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-xs"></i>}
              </div>
            </FormGroup>
            <FormGroup label="Variant">
              <div className="relative">
                {formData.variant === 'Custom' ? (
                  <input 
                    type="text" 
                    placeholder="Variant"
                    value={formData.customVariant}
                    onChange={(e) => setFormData({...formData, customVariant: e.target.value})}
                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-5 py-4 text-slate-700 dark:text-slate-200 font-bold outline-none"
                  />
                ) : (
                  <select 
                    value={formData.variant}
                    onChange={(e) => setFormData({...formData, variant: e.target.value})}
                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-5 py-4 text-slate-700 dark:text-slate-200 font-bold outline-none appearance-none cursor-pointer"
                  >
                    <option value="">Select variant</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="Custom">Other...</option>
                  </select>
                )}
                {formData.variant !== 'Custom' && <i className="fas fa-chevron-down absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-xs"></i>}
              </div>
            </FormGroup>
          </div>
        </div>

        {/* Performance Data Card */}
        <div className="bg-white dark:bg-slate-900 p-8 md:p-10 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-800 transition-colors">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-emerald-50 dark:bg-emerald-900/20 w-10 h-10 rounded-xl flex items-center justify-center text-emerald-500 dark:text-emerald-400">
              <i className="fas fa-chart-line text-lg"></i>
            </div>
            <h3 className="text-xl font-black text-slate-800 dark:text-slate-100">Performance Data</h3>
          </div>

          <div className="flex flex-col md:flex-row items-start gap-8 mb-12">
            <div className="flex-1 grid grid-cols-2 gap-6 w-full">
              <FormGroup label="Your Score">
                <input 
                  type="number" 
                  placeholder="Marks"
                  value={formData.userMark}
                  onChange={(e) => setFormData({...formData, userMark: e.target.value})}
                  className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-6 py-4 text-slate-700 dark:text-slate-200 font-bold outline-none focus:ring-4 focus:ring-blue-500/5 transition-all"
                />
              </FormGroup>
              <FormGroup label="Max Marks">
                <input 
                  type="number" 
                  placeholder="Total"
                  value={formData.totalMarks}
                  onChange={(e) => setFormData({...formData, totalMarks: e.target.value})}
                  className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-6 py-4 text-slate-700 dark:text-slate-200 font-bold outline-none focus:ring-4 focus:ring-blue-500/5 transition-all"
                />
              </FormGroup>
            </div>
            
            <div className="w-full md:w-48 bg-slate-50 dark:bg-slate-800 rounded-[3rem] flex flex-col items-center justify-center p-8 border border-slate-100 dark:border-slate-700 shadow-inner">
              <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Percentage</p>
              <p className="text-4xl font-black text-blue-600 dark:text-blue-400">{percentage !== null ? `${percentage}%` : '-'}</p>
            </div>
          </div>

          {/* Mistakes & Logic Errors Section (Merged) */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="text-lg font-black text-slate-800 dark:text-slate-100">Improvement Tracking</h4>
              <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Question Details & Mistakes</span>
            </div>

            <div className="space-y-3">
              {formData.mistakes.length === 0 ? (
                <p className="text-xs text-slate-400 dark:text-slate-500 italic px-2">No items logged for this session.</p>
              ) : (
                formData.mistakes.map((m) => (
                  <div key={m.id} className="flex items-center justify-between p-5 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-800 group transition-all">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex flex-col items-center justify-center text-[10px] font-black ${m.category === 'Conceptual Gap' ? 'bg-red-50 dark:bg-red-900/30 text-red-500' : 'bg-amber-50 dark:bg-amber-900/30 text-amber-500'}`}>
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
                      className="w-8 h-8 rounded-full flex items-center justify-center text-slate-300 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100"
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

      <div className="lg:col-span-4 space-y-6">
        <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-800 transition-colors">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-amber-50 dark:bg-amber-900/20 w-10 h-10 rounded-xl flex items-center justify-center text-amber-500 dark:text-amber-400">
              <i className="far fa-calendar-check"></i>
            </div>
            <h3 className="text-xl font-black text-slate-800 dark:text-slate-100">Completion Log</h3>
          </div>

          <FormGroup label="Completion Date">
            <input 
              type="date" 
              value={formData.dateCompleted}
              onChange={(e) => setFormData({...formData, dateCompleted: e.target.value})}
              className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-5 py-4 text-slate-700 dark:text-slate-200 font-bold outline-none focus:ring-4 focus:ring-blue-500/5"
            />
          </FormGroup>

          <div className="mt-8 space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200">Time Taken</label>
              <span className="text-[10px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-widest">Optional</span>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <input 
                  type="text" 
                  placeholder="Mins" 
                  value={formData.mins}
                  onChange={(e) => setFormData({...formData, mins: e.target.value})}
                  className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-4 py-4 text-center font-bold text-slate-700 dark:text-slate-200 outline-none"
                />
              </div>
              <span className="font-bold text-slate-300">:</span>
              <div className="flex-1">
                <input 
                  type="text" 
                  placeholder="Secs" 
                  value={formData.secs}
                  onChange={(e) => setFormData({...formData, secs: e.target.value})}
                  className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-4 py-4 text-center font-bold text-slate-700 dark:text-slate-200 outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <button 
            onClick={handleLog}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-6 rounded-[2.5rem] shadow-xl shadow-blue-500/20 transition-all text-lg active:scale-95 flex items-center justify-center gap-3"
          >
            Save to History
          </button>
          
          <button 
            onClick={handleClear}
            className="w-full text-slate-400 hover:text-slate-600 font-bold py-2 transition-colors text-[10px] uppercase tracking-widest"
          >
            Reset Form
          </button>
        </div>
      </div>

      <MistakeModal 
        isOpen={isMistakeModalOpen} 
        onClose={() => setIsMistakeModalOpen(false)} 
        onSave={handleAddMistake}
        paperName={subjects.find(s => s.id === formData.subjectId)?.name || 'Manual Log'}
      />
    </div>
  );
};

export default LogPaperForm;
