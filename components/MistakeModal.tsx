
import React, { useState } from 'react';
import { Mistake, MistakeCategory } from '../types';

interface MistakeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (mistake: Omit<Mistake, 'id'>) => void;
  paperName: string;
}

const PRESET_CATEGORIES = ['Silly Error', 'Conceptual Gap', 'Time Management', 'Misread Question', 'Calculated Error'];

const MistakeModal: React.FC<MistakeModalProps> = ({ isOpen, onClose, onSave, paperName }) => {
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<string>('Silly Error');
  const [customCategory, setCustomCategory] = useState('');
  const [isCustom, setIsCustom] = useState(false);
  const [questionNumber, setQuestionNumber] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSave = () => {
    if (!questionNumber.trim()) {
      setError('Question number is compulsory.');
      return;
    }
    const finalCategory = isCustom ? customCategory : category;
    if (!finalCategory.trim()) {
      setError('Category is compulsory.');
      return;
    }
    if (!description.trim()) {
      setError('Description is compulsory.');
      return;
    }

    onSave({ 
      category: finalCategory, 
      description, 
      questionNumber: questionNumber.trim() 
    });
    
    // Reset
    setDescription('');
    setQuestionNumber('');
    setCustomCategory('');
    setIsCustom(false);
    setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] w-full max-w-md shadow-2xl overflow-hidden border border-slate-100 dark:border-slate-800 transition-colors">
        <div className="p-8 border-b border-slate-50 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/30">
          <div>
            <h3 className="text-xl font-black text-slate-800 dark:text-slate-100">Log a Mistake</h3>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{paperName}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
            <i className="fas fa-times"></i>
          </button>
        </div>
        
        <div className="p-8 space-y-6">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-xl text-xs font-bold border border-red-100 dark:border-red-900/30 animate-pulse">
              <i className="fas fa-circle-exclamation mr-2"></i> {error}
            </div>
          )}

          <div className="grid grid-cols-3 gap-4">
             <div className="col-span-1 space-y-2">
                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Q# *</label>
                <input 
                  type="text"
                  placeholder="e.g. 4a"
                  value={questionNumber}
                  onChange={(e) => setQuestionNumber(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-4 text-slate-700 dark:text-slate-200 font-bold outline-none focus:ring-4 focus:ring-blue-500/5 transition-all"
                />
             </div>
             <div className="col-span-2 space-y-2">
                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Category *</label>
                <div className="relative">
                  <select 
                    value={isCustom ? 'Custom' : category}
                    onChange={(e) => {
                      if (e.target.value === 'Custom') {
                        setIsCustom(true);
                      } else {
                        setIsCustom(false);
                        setCategory(e.target.value);
                      }
                    }}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-5 py-4 text-slate-700 dark:text-slate-200 font-bold outline-none focus:ring-4 focus:ring-blue-500/5 transition-all appearance-none cursor-pointer"
                  >
                    {PRESET_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    <option value="Custom">Manual Entry...</option>
                  </select>
                  <i className="fas fa-chevron-down absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-xs"></i>
                </div>
             </div>
          </div>

          {isCustom && (
            <div className="space-y-2 animate-in slide-in-from-top-2 duration-300">
              <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Manual Category Entry</label>
              <input 
                type="text"
                placeholder="Enter custom category..."
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-6 py-4 text-slate-700 dark:text-slate-200 font-bold outline-none focus:ring-4 focus:ring-blue-500/5 transition-all"
                autoFocus
              />
            </div>
          )}
          
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">What went wrong? *</label>
            <textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g., Forgot to convert km/h to m/s"
              rows={3}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-6 py-4 text-slate-700 dark:text-slate-200 font-bold outline-none focus:ring-4 focus:ring-blue-500/5 transition-all resize-none"
            />
          </div>
        </div>
        
        <div className="p-8 bg-slate-50 dark:bg-slate-800/30 flex gap-4 border-t border-slate-50 dark:border-slate-800">
          <button 
            onClick={onClose}
            className="flex-1 px-6 py-4 rounded-2xl border border-slate-200 dark:border-slate-700 font-black text-slate-500 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800 transition-all text-xs uppercase tracking-widest"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            className="flex-1 bg-blue-600 text-white px-6 py-4 rounded-2xl font-black hover:bg-blue-700 shadow-lg shadow-blue-500/20 transition-all active:scale-95 text-xs uppercase tracking-widest"
          >
            Save Record
          </button>
        </div>
      </div>
    </div>
  );
};

export default MistakeModal;
