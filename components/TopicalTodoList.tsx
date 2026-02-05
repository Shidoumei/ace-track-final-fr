
import React, { useState, useMemo } from 'react';
import { Subject, StudyTopic, ConfidenceLevel } from '../types';

interface TopicalTodoListProps {
  subjects: Subject[];
  topics: StudyTopic[];
  onAddTopic: (topic: Omit<StudyTopic, 'id'>) => void;
  onUpdateTopic: (topic: StudyTopic) => void;
  onDeleteTopic: (id: string) => void;
}

const TopicalTodoList: React.FC<TopicalTodoListProps> = ({ subjects, topics, onAddTopic, onUpdateTopic, onDeleteTopic }) => {
  const [filters, setFilters] = useState({
    subject: 'All',
    confidence: 'All'
  });

  const [newTopic, setNewTopic] = useState({
    subjectId: '',
    unit: '',
    topic: '',
    confidence: ConfidenceLevel.UNSURE,
    completed: false,
    comment: ''
  });

  const [isAdding, setIsAdding] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [tempComment, setTempComment] = useState('');

  const filteredTopics = useMemo(() => {
    return topics.filter(t => {
      if (filters.subject !== 'All' && t.subjectId !== filters.subject) return false;
      if (filters.confidence !== 'All' && t.confidence !== filters.confidence) return false;
      return true;
    }).sort((a, b) => a.unit.localeCompare(b.unit));
  }, [topics, filters]);

  const stats = useMemo(() => {
    const total = filteredTopics.length;
    const redFlags = filteredTopics.filter(t => t.confidence === ConfidenceLevel.DIFFICULT).length;
    const unsure = filteredTopics.filter(t => t.confidence === ConfidenceLevel.UNSURE).length;
    const completed = filteredTopics.filter(t => t.completed).length;
    return { total, redFlags, unsure, completed };
  }, [filteredTopics]);

  const handleAdd = () => {
    if (!newTopic.subjectId || !newTopic.topic) return alert("Subject and Topic name are required.");
    onAddTopic({ ...newTopic });
    setNewTopic({ ...newTopic, topic: '', comment: '' });
    setIsAdding(false);
  };

  const cycleConfidence = (topic: StudyTopic) => {
    const levels = [ConfidenceLevel.CONFIDENT, ConfidenceLevel.UNSURE, ConfidenceLevel.DIFFICULT];
    const currentIndex = levels.indexOf(topic.confidence);
    const nextIndex = (currentIndex + 1) % levels.length;
    onUpdateTopic({ ...topic, confidence: levels[nextIndex] });
  };

  const toggleCompleted = (topic: StudyTopic) => {
    onUpdateTopic({ ...topic, completed: !topic.completed });
  };

  const startEditingComment = (topic: StudyTopic) => {
    setEditingCommentId(topic.id);
    setTempComment(topic.comment || '');
  };

  const saveComment = (topic: StudyTopic) => {
    onUpdateTopic({ ...topic, comment: tempComment });
    setEditingCommentId(null);
  };

  const getConfidenceColor = (level: ConfidenceLevel) => {
    switch (level) {
      case ConfidenceLevel.CONFIDENT: return 'bg-emerald-500';
      case ConfidenceLevel.UNSURE: return 'bg-amber-400';
      case ConfidenceLevel.DIFFICULT: return 'bg-red-500';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Stats Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm flex items-center justify-between group transition-colors">
          <div className="flex gap-8">
            <div>
              <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Progress</p>
              <p className="text-4xl font-black text-blue-600 dark:text-blue-400">{stats.completed}/{stats.total}</p>
              <p className="text-xs font-bold text-slate-400 mt-1">Topics Mastered</p>
            </div>
            <div className="border-l border-slate-100 dark:border-slate-800 pl-8">
              <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Red Flags</p>
              <p className="text-4xl font-black text-red-500">{stats.redFlags}</p>
              <p className="text-xs font-bold text-slate-400 mt-1">Struggling</p>
            </div>
          </div>
          <div className="w-16 h-16 rounded-3xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-500 dark:text-blue-400 text-2xl group-hover:scale-110 transition-transform">
            <i className="fas fa-tasks"></i>
          </div>
        </div>

        <button 
          onClick={() => setIsAdding(true)}
          className="bg-blue-600 hover:bg-blue-700 p-8 rounded-[2.5rem] shadow-xl shadow-blue-500/10 flex items-center justify-center gap-4 group transition-all active:scale-95"
        >
          <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-white text-xl">
            <i className="fas fa-plus"></i>
          </div>
          <span className="text-xl font-black text-white">Add Topic to Syllabus</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-800 flex flex-wrap items-end gap-6 transition-colors">
        <div className="flex-1 min-w-[180px]">
          <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">Filter Subject</label>
          <select 
            value={filters.subject} 
            onChange={(e) => setFilters(f => ({ ...f, subject: e.target.value }))}
            className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-5 py-3.5 font-bold text-slate-700 dark:text-slate-200 outline-none transition-colors"
          >
            <option value="All">All Subjects</option>
            {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>
        <div className="flex-1 min-w-[150px]">
          <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">Confidence</label>
          <select 
            value={filters.confidence} 
            onChange={(e) => setFilters(f => ({ ...f, confidence: e.target.value }))}
            className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-5 py-3.5 font-bold text-slate-700 dark:text-slate-200 outline-none transition-colors"
          >
            <option value="All">All Levels</option>
            {Object.values(ConfidenceLevel).map(l => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>
        <button onClick={() => setFilters({ subject: 'All', confidence: 'All' })} className="px-6 py-4 text-xs font-black uppercase text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-2xl transition-all">
          Reset Filters
        </button>
      </div>

      {/* Main Table */}
      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
              <th className="px-8 py-5 w-16">Done</th>
              <th className="px-8 py-5">Topic & Unit</th>
              <th className="px-6 py-5">Subject</th>
              <th className="px-6 py-5 text-center">Confidence Rating</th>
              <th className="px-8 py-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
            {filteredTopics.length === 0 ? (
              <tr><td colSpan={5} className="p-20 text-center text-slate-400 font-medium italic">No topics found. Start building your tracker!</td></tr>
            ) : (
              filteredTopics.map(topic => (
                <React.Fragment key={topic.id}>
                  <tr className={`hover:bg-slate-50/30 dark:hover:bg-slate-800/30 transition-colors group ${topic.completed ? 'opacity-60 grayscale-[0.5]' : ''}`}>
                    <td className="px-8 py-6">
                      <button 
                        onClick={() => toggleCompleted(topic)}
                        className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all ${
                          topic.completed 
                            ? 'bg-emerald-500 border-emerald-500 text-white' 
                            : 'border-slate-200 dark:border-slate-700 hover:border-emerald-400'
                        }`}
                      >
                        {topic.completed && <i className="fas fa-check text-[10px]"></i>}
                      </button>
                    </td>
                    <td className="px-8 py-6">
                      <p className={`font-black text-slate-800 dark:text-slate-100 ${topic.completed ? 'line-through' : ''}`}>
                        {topic.topic}
                      </p>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter mt-1">{topic.unit || 'General Unit'}</p>
                    </td>
                    <td className="px-6 py-6">
                      <span className="px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl text-[10px] font-black uppercase tracking-widest">
                        {subjects.find(s => s.id === topic.subjectId)?.name || 'Unknown'}
                      </span>
                    </td>
                    <td className="px-6 py-6 text-center">
                      <button 
                        onClick={() => cycleConfidence(topic)}
                        className="flex items-center gap-2 mx-auto px-5 py-2.5 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all group/conf border border-transparent hover:border-slate-100 dark:hover:border-slate-700"
                      >
                        <span className={`w-3 h-3 rounded-full shadow-sm transition-all ${getConfidenceColor(topic.confidence)} group-hover/conf:scale-125`}></span>
                        <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">{topic.confidence}</span>
                      </button>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => startEditingComment(topic)}
                          className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                            topic.comment 
                              ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-500' 
                              : 'text-slate-300 dark:text-slate-600 hover:text-blue-500'
                          }`}
                          title="Add comment"
                        >
                          <i className="far fa-comment-dots text-lg"></i>
                        </button>
                        <button 
                          onClick={() => onDeleteTopic(topic.id)}
                          className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-300 dark:text-slate-600 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all opacity-0 group-hover:opacity-100"
                        >
                          <i className="far fa-trash-alt"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                  {(editingCommentId === topic.id || topic.comment) && (
                    <tr className="bg-slate-50/20 dark:bg-slate-800/10">
                      <td></td>
                      <td colSpan={4} className="px-8 py-4">
                        {editingCommentId === topic.id ? (
                          <div className="flex gap-4 animate-in slide-in-from-top-2 duration-200">
                            <input 
                              type="text"
                              autoFocus
                              value={tempComment}
                              onChange={(e) => setTempComment(e.target.value)}
                              placeholder="Type your comment here..."
                              className="flex-1 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl px-4 py-2 text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500/20"
                            />
                            <button 
                              onClick={() => saveComment(topic)}
                              className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-black uppercase tracking-widest"
                            >
                              Save
                            </button>
                            <button 
                              onClick={() => setEditingCommentId(null)}
                              className="px-4 py-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 text-xs font-black uppercase tracking-widest"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-3 group/comment">
                            <i className="fas fa-quote-left text-blue-200 dark:text-slate-700 text-xs"></i>
                            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 italic flex-1">
                              {topic.comment}
                            </p>
                            <button 
                              onClick={() => startEditingComment(topic)}
                              className="opacity-0 group-hover/comment:opacity-100 text-[10px] font-black text-blue-500 uppercase tracking-widest transition-opacity"
                            >
                              Edit
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add Topic Modal */}
      {isAdding && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] w-full max-w-md shadow-2xl overflow-hidden border border-slate-100 dark:border-slate-800">
            <div className="p-8 border-b border-slate-50 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/30">
              <h3 className="text-xl font-black text-slate-800 dark:text-slate-100">Add New Topic</h3>
              <button onClick={() => setIsAdding(false)} className="text-slate-400 hover:text-slate-600">
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <div className="p-8 space-y-6 max-h-[60vh] overflow-y-auto">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Subject</label>
                <select 
                  value={newTopic.subjectId}
                  onChange={(e) => setNewTopic({...newTopic, subjectId: e.target.value})}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-5 py-4 text-slate-700 dark:text-slate-200 font-bold outline-none appearance-none"
                >
                  <option value="">Select subject</option>
                  {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Unit / Chapter</label>
                <input 
                  type="text"
                  placeholder="e.g. Unit 3: Microeconomics"
                  value={newTopic.unit}
                  onChange={(e) => setNewTopic({...newTopic, unit: e.target.value})}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-6 py-4 text-slate-700 dark:text-slate-200 font-bold outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Topic Name</label>
                <input 
                  type="text"
                  placeholder="e.g. Price Elasticity of Demand"
                  value={newTopic.topic}
                  onChange={(e) => setNewTopic({...newTopic, topic: e.target.value})}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-6 py-4 text-slate-700 dark:text-slate-200 font-bold outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Initial Confidence</label>
                <div className="flex gap-4">
                  {Object.values(ConfidenceLevel).map(level => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setNewTopic({...newTopic, confidence: level})}
                      className={`flex-1 py-3 rounded-2xl border-2 transition-all text-[10px] font-black uppercase tracking-widest ${
                        newTopic.confidence === level 
                          ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' 
                          : 'border-slate-100 dark:border-slate-800 text-slate-400 hover:border-slate-200 dark:hover:border-slate-700'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Initial Comment (Optional)</label>
                <input 
                  type="text"
                  placeholder="e.g. Needs focus on formula derivation"
                  value={newTopic.comment}
                  onChange={(e) => setNewTopic({...newTopic, comment: e.target.value})}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-6 py-4 text-slate-700 dark:text-slate-200 font-bold outline-none"
                />
              </div>
            </div>
            
            <div className="p-8 bg-slate-50 dark:bg-slate-800/30 flex gap-4 border-t border-slate-50 dark:border-slate-800">
              <button 
                type="button"
                onClick={() => setIsAdding(false)}
                className="flex-1 px-6 py-4 rounded-2xl border border-slate-200 dark:border-slate-700 font-black text-slate-500 dark:text-slate-400 text-xs uppercase tracking-widest hover:bg-white dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button 
                type="button"
                onClick={handleAdd}
                className="flex-1 bg-blue-600 text-white px-6 py-4 rounded-2xl font-black hover:bg-blue-700 shadow-lg shadow-blue-500/20 transition-all text-xs uppercase tracking-widest"
              >
                Add Topic
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TopicalTodoList;
