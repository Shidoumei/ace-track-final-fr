
import React, { useState } from 'react';
import { Subject, StudyTopic, ConfidenceLevel, StudyTask } from '../types';
import TopicalTodoList from './TopicalTodoList';
import StudyPlanner from './StudyPlanner';

interface StudyTrackerProps {
  subjects: Subject[];
  topics: StudyTopic[];
  onAddTopic: (topic: Omit<StudyTopic, 'id'>) => void;
  onUpdateTopic: (topic: StudyTopic) => void;
  onDeleteTopic: (id: string) => void;
  tasks: StudyTask[];
  onAddTask: (task: Omit<StudyTask, 'id'>) => void;
  onUpdateTask: (task: StudyTask) => void;
  onDeleteTask: (id: string) => void;
}

const StudyTracker: React.FC<StudyTrackerProps> = ({ 
  subjects, topics, onAddTopic, onUpdateTopic, onDeleteTopic,
  tasks, onAddTask, onUpdateTask, onDeleteTask
}) => {
  const [subView, setSubView] = useState<'topical' | 'planner'>('planner');

  return (
    <div className="space-y-6">
      {/* Sub-navigation Toggle */}
      <div className="flex justify-center mb-4">
        <div className="bg-white dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-1">
          <button 
            onClick={() => setSubView('planner')}
            className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
              subView === 'planner' 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 dark:shadow-none' 
                : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
            }`}
          >
            Study Planner
          </button>
          <button 
            onClick={() => setSubView('topical')}
            className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
              subView === 'topical' 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 dark:shadow-none' 
                : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
            }`}
          >
            Topical Todo List
          </button>
        </div>
      </div>

      <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
        {subView === 'topical' ? (
          <TopicalTodoList 
            subjects={subjects}
            topics={topics}
            onAddTopic={onAddTopic}
            onUpdateTopic={onUpdateTopic}
            onDeleteTopic={onDeleteTopic}
          />
        ) : (
          <StudyPlanner 
            subjects={subjects}
            tasks={tasks}
            onAddTask={onAddTask}
            onUpdateTask={onUpdateTask}
            onDeleteTask={onDeleteTask}
          />
        )}
      </div>
    </div>
  );
};

export default StudyTracker;
