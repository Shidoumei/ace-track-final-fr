
import React, { useState, useRef } from 'react';
import { Subject, ExamLevel, Grade, PaperProgress, TopicalProgress, StudyTask, StudyTopic } from '../types';
import { DailyTaskMap } from '../App';

const FormGroup = ({ label, children }: { label: string, children?: React.ReactNode }) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{label}</label>
    {children}
  </div>
);

interface ManageSubjectsProps {
  subjects: Subject[];
  progress: PaperProgress[];
  topicalProgress: TopicalProgress[];
  studyTopics: StudyTopic[];
  studyTasks: StudyTask[];
  dailyTasks: DailyTaskMap;
  onAddSubject: (subject: Subject) => void;
  onUpdateSubject: (subject: Subject) => void;
  onDeleteSubject: (id: string) => void;
  onImport: (data: { 
    subjects: Subject[], 
    progress: PaperProgress[], 
    topicalProgress: TopicalProgress[],
    studyTopics?: StudyTopic[],
    studyTasks?: StudyTask[],
    dailyTasks?: DailyTaskMap
  }) => void;
}

const ManageSubjects: React.FC<ManageSubjectsProps> = ({ 
  subjects, progress, topicalProgress, studyTopics, studyTasks, dailyTasks,
  onAddSubject, onUpdateSubject, onDeleteSubject, onImport 
}) => {
  const [modalMode, setModalMode] = useState<'add' | 'edit' | null>(null);
  const [currentSubject, setCurrentSubject] = useState<Partial<Subject>>({
    name: '', code: '', level: ExamLevel.IGCSE, examBoard: 'Cambridge', syllabus: '2026', targetGrade: 'A' as Grade
  });
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleOpenAdd = () => {
    setCurrentSubject({ name: '', code: '', level: ExamLevel.IGCSE, examBoard: 'Cambridge', syllabus: '2026', targetGrade: 'A' });
    setModalMode('add');
  };

  const handleOpenEdit = (subject: Subject) => {
    setCurrentSubject({ ...subject });
    setModalMode('edit');
  };

  const handleSubmit = () => {
    if (!currentSubject.name || !currentSubject.code) return alert("Please fill in subject details");
    if (modalMode === 'add') {
      onAddSubject({
        id: Math.random().toString(36).substring(7),
        name: currentSubject.name || '',
        code: currentSubject.code || '',
        level: currentSubject.level || ExamLevel.IGCSE,
        examBoard: currentSubject.examBoard || 'Cambridge',
        syllabus: currentSubject.syllabus || '2026',
        targetGrade: currentSubject.targetGrade || 'A',
        papers: [] 
      });
    } else if (modalMode === 'edit' && currentSubject.id) {
      onUpdateSubject(currentSubject as Subject);
    }
    setModalMode(null);
  };

  const handleExport = () => {
    const data = { 
      subjects, 
      progress, 
      topicalProgress, 
      studyTopics, 
      studyTasks, 
      dailyTasks,
      version: "2.0",
      exportDate: new Date().toISOString() 
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `acetrack-master-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (json.subjects && json.progress) {
          onImport(json);
          alert("Backup successfully restored. All logs and streaks are now active!");
        } else {
          alert("Invalid backup file. Missing core data fields.");
        }
      } catch (err) {
        alert("Failed to read the backup file. Please ensure it is a valid JSON.");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-12 animate-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#1E293B] dark:text-slate-100">Curriculum Setup</h1>
          <p className="text-slate-400 dark:text-slate-500 font-medium">Configure your subjects and manage your global database</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <button 
            onClick={handleOpenAdd}
            className="flex-1 md:flex-none bg-blue-600 hover:bg-blue-700 dark:bg-gold dark:text-black text-white font-black px-8 py-4 rounded-2xl flex items-center justify-center gap-3 shadow-xl transition-all active:scale-95"
          >
            <i className="fas fa-plus"></i> Add Subject
          </button>
        </div>
      </div>

      {/* Subjects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {subjects.map(subject => (
          <div key={subject.id} className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden hover:shadow-2xl transition-all group flex flex-col relative">
            <div className="p-8 flex-1">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-5">
                  <div className="bg-slate-50 dark:bg-slate-800 w-16 h-16 rounded-3xl flex items-center justify-center text-slate-400 dark:text-slate-500 text-2xl group-hover:bg-blue-600 dark:group-hover:bg-gold dark:group-hover:text-black group-hover:text-white transition-all duration-500">
                    <i className="fas fa-atom"></i>
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-[#1E293B] dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-gold transition-colors">{subject.name}</h3>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <Badge text={subject.code} color="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-gold" />
                      <Badge text={`Goal: ${subject.targetGrade || 'A'}`} color="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400" />
                    </div>
                  </div>
                </div>
                <button 
                  onClick={(e) => { e.stopPropagation(); onDeleteSubject(subject.id); }}
                  className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-300 dark:text-slate-600 hover:text-red-500 transition-all"
                >
                  <i className="far fa-trash-alt"></i>
                </button>
              </div>
            </div>
            
            <div className="px-8 py-6 bg-[#F8FAFC] dark:bg-slate-800/50 border-t border-slate-50 dark:border-slate-800 flex justify-between items-center">
              <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{subject.level}</span>
              <button 
                onClick={() => handleOpenEdit(subject)}
                className="text-blue-600 dark:text-gold font-black text-xs flex items-center gap-2 hover:translate-x-1 transition-transform uppercase tracking-widest"
              >
                Modify <i className="fas fa-chevron-right text-[10px]"></i>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Data Vault Section */}
      <div className="mt-12 p-10 bg-slate-100 dark:bg-slate-900/50 rounded-[3rem] border border-dashed border-slate-300 dark:border-slate-800 text-center">
        <div className="bg-white dark:bg-slate-800 w-16 h-16 rounded-3xl flex items-center justify-center text-slate-400 dark:text-gold text-2xl mx-auto mb-6 shadow-sm">
          <i className="fas fa-shield-halved"></i>
        </div>
        <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100 mb-3">Master Data Vault</h2>
        <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-8 font-medium">
          Securely export your entire study ecosystem—including Daily PPQ streaks and all performance logs—or restore them to a new device.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <button 
            onClick={handleExport}
            className="bg-white dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 font-bold px-8 py-4 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center gap-3 transition-all"
          >
            <i className="fas fa-download text-blue-500 dark:text-gold"></i> Export All Data
          </button>
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="bg-white dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 font-bold px-8 py-4 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center gap-3 transition-all"
          >
            <i className="fas fa-upload text-emerald-500"></i> Restore from Backup
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            className="hidden" 
            accept=".json"
          />
        </div>
      </div>

      {/* Modal */}
      {modalMode && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-900 rounded-[3rem] w-full max-w-md shadow-2xl p-10 space-y-8 border border-slate-100 dark:border-slate-800">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-black text-[#1E293B] dark:text-slate-100">{modalMode === 'add' ? 'New Subject' : 'Curriculum Config'}</h3>
              <button onClick={() => setModalMode(null)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="space-y-5">
              <FormGroup label="Subject Name">
                <input type="text" placeholder="e.g. Physics" value={currentSubject.name} onChange={(e) => setCurrentSubject({...currentSubject, name: e.target.value})} className="w-full bg-[#F8FAFC] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-6 py-4 text-slate-700 dark:text-slate-200 font-bold outline-none" />
              </FormGroup>
              <div className="grid grid-cols-2 gap-4">
                <FormGroup label="Code">
                  <input type="text" placeholder="9702" value={currentSubject.code} onChange={(e) => setCurrentSubject({...currentSubject, code: e.target.value})} className="w-full bg-[#F8FAFC] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-6 py-4 text-slate-700 dark:text-slate-200 font-bold outline-none" />
                </FormGroup>
                <FormGroup label="Target">
                  <select value={currentSubject.targetGrade} onChange={(e) => setCurrentSubject({...currentSubject, targetGrade: e.target.value as Grade})} className="w-full bg-[#F8FAFC] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-6 py-4 text-slate-700 dark:text-slate-200 font-bold outline-none">
                    {['A*', 'A', 'B', 'C', 'D'].map(g => <option key={g} value={g} className="dark:bg-slate-900">{g}</option>)}
                  </select>
                </FormGroup>
              </div>
            </div>
            <button onClick={handleSubmit} className="w-full bg-blue-600 dark:bg-gold dark:text-black text-white font-black py-5 rounded-[2rem] shadow-2xl transition-all active:scale-95">
              {modalMode === 'add' ? 'Confirm Subject' : 'Save Changes'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const Badge = ({ text, color }: { text: string, color: string }) => (
  <span className={`${color} px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest`}>
    {text}
  </span>
);

export default ManageSubjects;
