
import React, { useState, useMemo } from 'react';
import { Subject, StudyTask, TaskPriority, TaskType } from '../types';

interface StudyPlannerProps {
  subjects: Subject[];
  tasks: StudyTask[];
  onAddTask: (task: Omit<StudyTask, 'id'>) => void;
  onUpdateTask: (task: StudyTask) => void;
  onDeleteTask: (id: string) => void;
}

const StudyPlanner: React.FC<StudyPlannerProps> = ({ subjects, tasks, onAddTask, onUpdateTask, onDeleteTask }) => {
  const [viewMode, setViewMode] = useState<'Day' | 'Week' | 'Month'>('Day');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [viewingTask, setViewingTask] = useState<StudyTask | null>(null);

  const [newTask, setNewTask] = useState<Omit<StudyTask, 'id'>>({
    title: '',
    date: new Date().toISOString().split('T')[0],
    allDay: false,
    startTime: '09:00',
    endTime: '10:00',
    priority: TaskPriority.MEDIUM,
    type: TaskType.REVISION,
    subjectId: '',
    repeat: 'Does not repeat',
    notes: '',
    completed: false
  });

  const formattedDate = currentDate.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  const formattedFullDate = currentDate.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  const handlePrevDate = () => {
    const newDate = new Date(currentDate);
    if (viewMode === 'Day') newDate.setDate(newDate.getDate() - 1);
    else if (viewMode === 'Week') newDate.setDate(newDate.getDate() - 7);
    else newDate.setMonth(newDate.getMonth() - 1);
    setCurrentDate(newDate);
  };

  const handleNextDate = () => {
    const newDate = new Date(currentDate);
    if (viewMode === 'Day') newDate.setDate(newDate.getDate() + 1);
    else if (viewMode === 'Week') newDate.setDate(newDate.getDate() + 7);
    else newDate.setMonth(newDate.getMonth() + 1);
    setCurrentDate(newDate);
  };

  const handleGoToToday = () => setCurrentDate(new Date());

  const tasksToday = tasks.filter(t => t.date === currentDate.toISOString().split('T')[0]);

  const handleCreateTask = () => {
    if (!newTask.title) return alert("Task title is required");
    onAddTask(newTask);
    setIsAddingTask(false);
    setNewTask({
      ...newTask,
      title: '',
      notes: ''
    });
  };

  const hours = Array.from({ length: 24 }).map((_, i) => {
    const hourNum = i === 0 ? 12 : i > 12 ? i - 12 : i;
    const ampm = i >= 12 ? 'PM' : 'AM';
    return `${hourNum} ${ampm}`;
  });

  const getPriorityColors = (priority: TaskPriority) => {
    switch (priority) {
      case TaskPriority.HIGH:
        return 'bg-red-50 dark:bg-red-900/20 border-red-500 text-red-700 dark:text-red-300';
      case TaskPriority.MEDIUM:
        return 'bg-amber-50 dark:bg-amber-900/20 border-amber-400 text-amber-700 dark:text-amber-300';
      case TaskPriority.LOW:
      default:
        return 'bg-blue-50 dark:bg-blue-900/20 border-blue-400 text-blue-700 dark:text-blue-300';
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500 bg-[#F5F8FA] dark:bg-slate-950 p-6 rounded-[3rem] border border-slate-100 dark:border-slate-800 min-h-[800px] relative overflow-hidden transition-colors">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(#1e293b 0.5px, transparent 0.5px)', backgroundSize: '20px 20px' }}></div>
      
      {/* Top Header Bar */}
      <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-6 z-10">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white text-2xl shadow-xl shadow-blue-500/20 transition-all">
            <i className="far fa-calendar-alt"></i>
          </div>
          <div>
            <h2 className="text-3xl font-black text-slate-800 dark:text-slate-100 transition-colors">{formattedDate}</h2>
            <p className="text-slate-400 dark:text-slate-500 font-bold text-sm tracking-tight transition-colors">{formattedFullDate}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="bg-white dark:bg-slate-900 p-1 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-1 transition-colors">
            {['Day', 'Week', 'Month'].map(mode => (
              <button 
                key={mode}
                onClick={() => setViewMode(mode as any)}
                className={`px-6 py-2 rounded-xl text-xs font-black transition-all ${
                  viewMode === mode 
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-200 dark:shadow-none' 
                    : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button onClick={handlePrevDate} className="w-10 h-10 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-all flex items-center justify-center shadow-sm">
              <i className="fas fa-chevron-left text-xs"></i>
            </button>
            <button onClick={handleNextDate} className="w-10 h-10 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-all flex items-center justify-center shadow-sm">
              <i className="fas fa-chevron-right text-xs"></i>
            </button>
          </div>

          <button onClick={handleGoToToday} className="px-6 py-2.5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl text-xs font-black text-blue-600 dark:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm">
            Today
          </button>
          
          <button 
            onClick={() => setIsAddingTask(true)}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black shadow-lg shadow-blue-500/20 flex items-center gap-2 active:scale-95 transition-all"
          >
            <i className="fas fa-plus"></i> Add Task
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:grid lg:grid-cols-12 gap-8 relative z-10 flex-1">
        {/* Left Sidebar */}
        <div className="lg:col-span-3 space-y-6">
          {/* Mini Calendar Widget */}
          <div className="bg-[#1e293b] dark:bg-slate-900 text-white p-6 rounded-[2.5rem] shadow-xl border dark:border-slate-800 transition-colors">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-black text-lg">{currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</h3>
              <div className="flex gap-2">
                <i className="fas fa-chevron-left text-[10px] opacity-50"></i>
                <i className="fas fa-chevron-right text-[10px] opacity-50"></i>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-[9px] font-black uppercase text-slate-400 dark:text-slate-500 mb-4">
              {['mo','tu','we','th','fr','sa','su'].map(d => <div key={d}>{d}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: 31 }).map((_, i) => (
                <div key={i} className={`h-8 w-8 flex items-center justify-center rounded-xl text-xs font-bold transition-all ${
                  i + 1 === currentDate.getDate() 
                    ? 'bg-white text-slate-900 dark:bg-blue-600 dark:text-white' 
                    : 'text-slate-400 hover:bg-white/10 dark:hover:bg-slate-800 cursor-pointer'
                }`}>
                  {i + 1}
                </div>
              ))}
            </div>
            <button 
              onClick={handleGoToToday}
              className="w-full mt-6 py-3 bg-blue-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg"
            >
              Go to Today
            </button>
          </div>

          {/* Upcoming Tasks Widget */}
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-800 flex-1 transition-colors">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-black text-slate-800 dark:text-slate-100 transition-colors">Upcoming Tasks</h3>
              <span className="w-6 h-6 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-[10px] font-black">{tasks.length}</span>
            </div>
            
            {tasks.length === 0 ? (
              <div className="py-10 text-center flex flex-col items-center">
                <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-300 dark:text-slate-600 mb-4 transition-colors">
                  <i className="far fa-calendar-check"></i>
                </div>
                <p className="text-slate-400 dark:text-slate-500 text-xs font-bold transition-colors">No upcoming tasks</p>
                <button onClick={() => setIsAddingTask(true)} className="mt-2 text-[10px] text-blue-500 dark:text-blue-400 font-black uppercase hover:underline transition-colors">Add one now</button>
              </div>
            ) : (
              <div className="space-y-4">
                {tasks.slice(0, 5).map(task => (
                  <div key={task.id} className="flex gap-4 group cursor-pointer" onClick={() => setViewingTask(task)}>
                    <div className={`w-1 h-8 rounded-full ${task.priority === TaskPriority.HIGH ? 'bg-red-500' : task.priority === TaskPriority.MEDIUM ? 'bg-amber-400' : 'bg-blue-400'}`}></div>
                    <div>
                      <p className="text-sm font-bold text-slate-800 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{task.title}</p>
                      <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-tighter mt-0.5 transition-colors">{task.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Main Schedule Area */}
        <div className="lg:col-span-9 bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden flex flex-col transition-colors">
          <div className="p-8 border-b border-slate-50 dark:border-slate-800 flex justify-between items-center bg-slate-50/30 dark:bg-slate-800/30 transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-600 rounded-2xl flex flex-col items-center justify-center text-white shadow-lg shadow-blue-500/10">
                <span className="text-sm font-black leading-none">{currentDate.getDate()}</span>
                <span className="text-[8px] font-black uppercase">{currentDate.toLocaleDateString('en-US', { weekday: 'short' })}</span>
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-800 dark:text-slate-100 transition-colors">{currentDate.toLocaleDateString('en-US', { weekday: 'long' })}</h3>
                <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest transition-colors">{currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest transition-colors">Tasks today</p>
                <p className="text-xl font-black text-slate-800 dark:text-slate-100 transition-colors">{tasksToday.length}</p>
              </div>
              <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center text-lg transition-colors">
                <i className="far fa-clock"></i>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto scrollbar-hide relative min-h-[600px]">
            {/* Time Grid */}
            <div className="grid grid-cols-[80px_1fr] divide-x divide-slate-50 dark:divide-slate-800 min-h-full transition-colors">
              <div className="bg-slate-50/30 dark:bg-slate-800/20 divide-y divide-slate-100/50 dark:divide-slate-800 transition-colors">
                {hours.map((h, i) => (
                  <div key={i} className="h-20 px-3 py-4 text-right">
                    <span className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-tighter whitespace-nowrap transition-colors">{h}</span>
                  </div>
                ))}
              </div>
              <div className="relative divide-y divide-slate-50 dark:divide-slate-800 transition-colors">
                {Array.from({ length: 24 }).map((_, i) => (
                  <div key={i} className="h-20 relative group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-all cursor-pointer">
                    {/* Render Tasks for this hour */}
                    {tasksToday.map(task => {
                      const startHour = parseInt(task.startTime.split(':')[0]);
                      const startMin = parseInt(task.startTime.split(':')[1]);
                      const endHour = parseInt(task.endTime.split(':')[0]);
                      const endMin = parseInt(task.endTime.split(':')[1]);
                      
                      if (startHour === i) {
                        const top = (startMin / 60) * 80;
                        const durationMins = (endHour * 60 + endMin) - (startHour * 60 + startMin);
                        const height = (durationMins / 60) * 80;
                        
                        return (
                          <div 
                            key={task.id}
                            style={{ top: `${top}px`, height: `${height}px` }}
                            className={`absolute left-2 right-2 rounded-2xl p-4 shadow-xl flex flex-col justify-between z-20 border-l-[6px] overflow-hidden transition-all hover:scale-[1.01] hover:shadow-2xl ${getPriorityColors(task.priority)}`}
                          >
                            <div className="flex justify-between items-start">
                              <div className="min-w-0">
                                <p className="text-[10px] font-black uppercase tracking-widest opacity-70 mb-1">{task.startTime} - {task.endTime}</p>
                                <h4 className={`text-sm font-black truncate ${task.completed ? 'line-through opacity-50' : ''}`}>{task.title}</h4>
                              </div>
                              <div className="opacity-0 group-hover:opacity-100 transition-all flex gap-1.5 ml-2">
                                <button 
                                  onClick={(e) => { e.stopPropagation(); setViewingTask(task); }} 
                                  className="w-7 h-7 rounded-lg bg-white/50 dark:bg-black/20 flex items-center justify-center hover:bg-white dark:hover:bg-black transition-all"
                                  title="View Details"
                                >
                                  <i className="far fa-eye text-[10px]"></i>
                                </button>
                                <button 
                                  onClick={(e) => { e.stopPropagation(); onUpdateTask({...task, completed: !task.completed}); }} 
                                  className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${task.completed ? 'bg-emerald-500 text-white' : 'bg-white/50 dark:bg-black/20 hover:bg-emerald-500 hover:text-white'}`}
                                  title={task.completed ? "Mark Incomplete" : "Mark Complete"}
                                >
                                  <i className={`fas ${task.completed ? 'fa-check-circle' : 'fa-circle-check'} text-[10px]`}></i>
                                </button>
                                <button 
                                  onClick={(e) => { e.stopPropagation(); onDeleteTask(task.id); }} 
                                  className="w-7 h-7 rounded-lg bg-white/50 dark:bg-black/20 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all"
                                  title="Delete Task"
                                >
                                  <i className="fas fa-trash-alt text-[10px]"></i>
                                </button>
                              </div>
                            </div>
                            <div className="mt-2">
                              <span className="text-[9px] font-black uppercase bg-white/40 dark:bg-black/10 px-2 py-1 rounded-lg border border-white/20">
                                {task.type}
                              </span>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* View Task Modal */}
      {viewingTask && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] w-full max-w-lg shadow-2xl overflow-hidden border border-slate-100 dark:border-slate-800 transition-colors">
            <div className={`h-3 w-full ${getPriorityColors(viewingTask.priority).split(' ')[2]}`}></div>
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest ${getPriorityColors(viewingTask.priority)}`}>
                      {viewingTask.priority} Priority
                    </span>
                    <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-xl text-[10px] font-black uppercase tracking-widest">
                      {viewingTask.type}
                    </span>
                  </div>
                  <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100">{viewingTask.title}</h3>
                </div>
                <button onClick={() => setViewingTask(null)} className="w-10 h-10 rounded-full flex items-center justify-center text-slate-400 dark:text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
                  <i className="fas fa-times"></i>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Date</p>
                  <p className="font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2">
                    <i className="far fa-calendar text-blue-500"></i>
                    {new Date(viewingTask.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Time</p>
                  <p className="font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2">
                    <i className="far fa-clock text-blue-500"></i>
                    {viewingTask.allDay ? 'All Day' : `${viewingTask.startTime} - ${viewingTask.endTime}`}
                  </p>
                </div>
                {viewingTask.subjectId && (
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Subject</p>
                    <p className="font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2">
                      <i className="fas fa-book text-blue-500"></i>
                      {subjects.find(s => s.id === viewingTask.subjectId)?.name || 'Unknown Subject'}
                    </p>
                  </div>
                )}
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Status</p>
                  <p className={`font-bold flex items-center gap-2 ${viewingTask.completed ? 'text-emerald-500' : 'text-amber-500'}`}>
                    <i className={`fas ${viewingTask.completed ? 'fa-check-circle' : 'fa-spinner'}`}></i>
                    {viewingTask.completed ? 'Completed' : 'Pending'}
                  </p>
                </div>
              </div>

              {viewingTask.notes && (
                <div className="space-y-2 mb-8">
                  <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Notes</p>
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400 text-sm italic leading-relaxed">
                    "{viewingTask.notes}"
                  </div>
                </div>
              )}

              <div className="flex gap-4">
                <button 
                  onClick={() => {
                    onUpdateTask({...viewingTask, completed: !viewingTask.completed});
                    setViewingTask(null);
                  }}
                  className={`flex-1 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg active:scale-95 ${
                    viewingTask.completed 
                      ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/20' 
                      : 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/20'
                  }`}
                >
                  {viewingTask.completed ? 'Mark Incomplete' : 'Mark as Done'}
                </button>
                <button 
                  onClick={() => {
                    if (confirm("Are you sure you want to delete this task?")) {
                      onDeleteTask(viewingTask.id);
                      setViewingTask(null);
                    }
                  }}
                  className="px-6 py-4 rounded-2xl border border-red-100 dark:border-red-900/30 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 font-black text-xs uppercase tracking-widest transition-all"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Task Modal */}
      {isAddingTask && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] w-full max-w-lg shadow-2xl overflow-hidden border border-slate-100 dark:border-slate-800 transition-colors">
            <div className="p-8 border-b border-slate-50 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/30 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white">
                  <i className="far fa-calendar-plus"></i>
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-800 dark:text-slate-100 transition-colors">Add New Task</h3>
                  <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest transition-colors">Plan your study sessions</p>
                </div>
              </div>
              <button onClick={() => setIsAddingTask(false)} className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto scrollbar-hide">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-800 dark:text-slate-100 transition-colors">What do you need to do? *</label>
                <input 
                  type="text"
                  placeholder="e.g., Physics Chapter 5 Revision"
                  value={newTask.title}
                  onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-6 py-4 text-slate-700 dark:text-slate-200 font-bold outline-none focus:ring-4 focus:ring-blue-500/5 transition-all"
                />
              </div>

              <div className="bg-blue-50/30 dark:bg-blue-900/10 rounded-3xl p-6 border border-blue-50 dark:border-blue-900/20 space-y-4 transition-colors">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                    <i className="far fa-calendar"></i>
                    <span className="text-xs font-black uppercase tracking-widest">When?</span>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 rounded border-slate-300 dark:border-slate-700 text-blue-600 focus:ring-blue-500 bg-white dark:bg-slate-800 transition-colors" 
                      checked={newTask.allDay} 
                      onChange={(e) => setNewTask({...newTask, allDay: e.target.checked})}
                    />
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-400 group-hover:text-blue-500 transition-colors">All day</span>
                  </label>
                </div>
                
                <input 
                  type="date"
                  value={newTask.date}
                  onChange={(e) => setNewTask({...newTask, date: e.target.value})}
                  className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 dark:text-slate-200 outline-none focus:border-blue-400 transition-all"
                />

                {!newTask.allDay && (
                  <>
                    <div className="flex gap-2">
                      {['Morning', 'Noon', 'Afternoon', 'Evening'].map(time => (
                        <button 
                          key={time}
                          type="button"
                          onClick={() => {
                            const times: Record<string, [string, string]> = {
                              'Morning': ['08:00', '10:00'],
                              'Noon': ['12:00', '14:00'],
                              'Afternoon': ['15:00', '17:00'],
                              'Evening': ['19:00', '21:00']
                            };
                            setNewTask({...newTask, startTime: times[time][0], endTime: times[time][1]});
                          }}
                          className="flex-1 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-[10px] font-black uppercase tracking-tighter text-slate-500 dark:text-slate-400 hover:border-blue-300 dark:hover:border-blue-700 transition-all"
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                    
                    <div className="flex items-center gap-6">
                      <div className="flex-1 space-y-2">
                        <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block transition-colors">START</label>
                        <div className="relative group/time">
                          <input 
                            type="time" 
                            value={newTask.startTime} 
                            onChange={(e) => setNewTask({...newTask, startTime: e.target.value})}
                            className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[2rem] px-8 py-5 text-xl font-black text-slate-800 dark:text-slate-100 outline-none hover:border-blue-400 transition-all text-center focus:ring-4 focus:ring-blue-500/10 shadow-sm"
                          />
                        </div>
                      </div>
                      <div className="pt-8 text-slate-300 dark:text-slate-700">
                        <i className="fas fa-arrow-right text-lg"></i>
                      </div>
                      <div className="flex-1 space-y-2">
                        <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block transition-colors">END</label>
                        <div className="relative group/time">
                          <input 
                            type="time" 
                            value={newTask.endTime} 
                            onChange={(e) => setNewTask({...newTask, endTime: e.target.value})}
                            className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[2rem] px-8 py-5 text-xl font-black text-slate-800 dark:text-slate-100 outline-none hover:border-blue-400 transition-all text-center focus:ring-4 focus:ring-blue-500/10 shadow-sm"
                          />
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500 transition-colors">
                  <i className="far fa-flag"></i>
                  <span className="text-xs font-black uppercase tracking-widest transition-colors">Priority</span>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {Object.values(TaskPriority).map(p => (
                    <button 
                      key={p}
                      type="button"
                      onClick={() => setNewTask({...newTask, priority: p})}
                      className={`py-3 rounded-2xl border-2 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all ${
                        newTask.priority === p 
                          ? (p === TaskPriority.HIGH ? 'bg-red-50 dark:bg-red-900/30 border-red-500 text-red-600 dark:text-red-400' : p === TaskPriority.MEDIUM ? 'bg-amber-50 dark:bg-amber-900/30 border-amber-400 text-amber-600 dark:text-amber-400' : 'bg-blue-50 dark:bg-blue-900/30 border-blue-400 text-blue-600 dark:text-blue-400')
                          : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-400 dark:text-slate-500 hover:border-slate-200 dark:hover:border-slate-600'
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full ${p === TaskPriority.HIGH ? 'bg-red-500' : p === TaskPriority.MEDIUM ? 'bg-amber-400' : 'bg-blue-400'}`}></span>
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500 transition-colors">
                  <i className="far fa-bookmark"></i>
                  <span className="text-xs font-black uppercase tracking-widest transition-colors">Type</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {Object.values(TaskType).map(t => (
                    <button 
                      key={t}
                      type="button"
                      onClick={() => setNewTask({...newTask, type: t})}
                      className={`px-4 py-2.5 rounded-xl border-2 text-[10px] font-black uppercase tracking-widest transition-all ${
                        newTask.type === t 
                          ? 'bg-blue-600 border-blue-600 text-white' 
                          : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-400 dark:text-slate-500 hover:border-slate-200 dark:hover:border-slate-600'
                      }`}
                    >
                      {t.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500 transition-colors">
                    <i className="fas fa-book text-[10px]"></i>
                    <span className="text-xs font-black uppercase tracking-widest transition-colors">Subject</span>
                  </div>
                  <select 
                    value={newTask.subjectId}
                    onChange={(e) => setNewTask({...newTask, subjectId: e.target.value})}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-5 py-4 text-slate-700 dark:text-slate-200 font-bold outline-none focus:ring-4 focus:ring-blue-500/5 transition-all appearance-none cursor-pointer"
                  >
                    <option value="">None</option>
                    {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500 transition-colors">
                    <i className="fas fa-sync text-[10px]"></i>
                    <span className="text-xs font-black uppercase tracking-widest transition-colors">Repeat</span>
                  </div>
                  <select 
                    value={newTask.repeat}
                    onChange={(e) => setNewTask({...newTask, repeat: e.target.value})}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-5 py-4 text-slate-700 dark:text-slate-200 font-bold outline-none focus:ring-4 focus:ring-blue-500/5 transition-all appearance-none cursor-pointer"
                  >
                    <option value="Does not repeat">Does not repeat</option>
                    <option value="Daily">Daily</option>
                    <option value="Weekly">Weekly</option>
                    <option value="Monthly">Monthly</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-slate-800 dark:text-slate-100 transition-colors">Notes (optional)</label>
                <textarea 
                  value={newTask.notes}
                  onChange={(e) => setNewTask({...newTask, notes: e.target.value})}
                  rows={3}
                  placeholder="Add any additional details..."
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-6 py-4 text-slate-700 dark:text-slate-200 font-bold outline-none resize-none focus:ring-4 focus:ring-blue-500/5 transition-all"
                />
              </div>
            </div>
            
            <div className="p-8 bg-slate-50 dark:bg-slate-800/30 flex gap-4 border-t border-slate-50 dark:border-slate-800 transition-colors">
              <button 
                type="button"
                onClick={() => setIsAddingTask(false)}
                className="flex-1 px-6 py-4 rounded-2xl font-black text-slate-400 dark:text-slate-500 text-xs uppercase tracking-widest hover:text-slate-600 dark:hover:text-slate-300 transition-all"
              >
                Cancel
              </button>
              <button 
                type="button"
                onClick={handleCreateTask}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 rounded-2xl font-black shadow-xl shadow-blue-500/20 transition-all text-xs uppercase tracking-widest active:scale-95"
              >
                Create Task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudyPlanner;
