
import React, { useState, useEffect, useCallback } from 'react';
import Layout from './components/Layout';
import Performance from './components/Performance';
import SubjectDetail from './components/SubjectDetail';
import LogPaperForm from './components/LogPaperForm';
import LogTopicalForm from './components/LogTopicalForm';
import ManageSubjects from './components/ManageSubjects';
import History from './components/History';
import Planner from './components/Planner';
import StudyTracker from './components/StudyTracker';
import Auth from './components/Auth';
import { MOCK_SUBJECTS } from './constants';
import { PaperProgress, TopicalProgress, Subject, StudyTopic, StudyTask } from './types';

interface User {
  name: string;
  email: string;
}

export type DailyTaskMap = Record<string, Record<string, boolean>>;
export type ThemeMode = 'light' | 'dark' | 'gold';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'performance' | 'subjects' | 'topical' | 'manage' | 'history' | 'planner' | 'tracker'>('tracker');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);
  
  const [progress, setProgress] = useState<PaperProgress[]>([]);
  const [topicalProgress, setTopicalProgress] = useState<TopicalProgress[]>([]);
  const [studyTopics, setStudyTopics] = useState<StudyTopic[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [dailyTasks, setDailyTasks] = useState<DailyTaskMap>({});
  const [studyTasks, setStudyTasks] = useState<StudyTask[]>([]);
  
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('ace_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('ace_theme') as ThemeMode;
    return saved || 'light';
  });

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('dark', 'theme-gold');
    
    if (theme === 'dark') {
      root.classList.add('dark');
    } else if (theme === 'gold') {
      root.classList.add('dark', 'theme-gold');
    }
    
    localStorage.setItem('ace_theme', theme);
  }, [theme]);

  // Unique key generator for multi-user storage isolation
  const getUserKey = useCallback((base: string) => {
    if (!user) return null;
    const safeEmail = user.email.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
    return `acetrack_v3_${safeEmail}_${base}`;
  }, [user]);

  // Load User Specific Data whenever user changes
  useEffect(() => {
    if (!user) {
      localStorage.removeItem('ace_user');
      return;
    }

    localStorage.setItem('ace_user', JSON.stringify(user));

    const progressKey = getUserKey('progress');
    const topicalKey = getUserKey('topical');
    const topicsKey = getUserKey('study_topics');
    const subjectsKey = getUserKey('subjects');
    const tasksKey = getUserKey('daily_tasks');
    const studyTasksKey = getUserKey('study_tasks');

    const savedProgress = progressKey ? localStorage.getItem(progressKey) : null;
    const savedTopical = topicalKey ? localStorage.getItem(topicalKey) : null;
    const savedTopics = topicsKey ? localStorage.getItem(topicsKey) : null;
    const savedSubjects = subjectsKey ? localStorage.getItem(subjectsKey) : null;
    const savedTasks = tasksKey ? localStorage.getItem(tasksKey) : null;
    const savedStudyTasks = studyTasksKey ? localStorage.getItem(studyTasksKey) : null;
    
    if (savedProgress) {
      try { setProgress(JSON.parse(savedProgress)); } catch (e) { setProgress([]); }
    } else { setProgress([]); }

    if (savedTopical) {
      try { setTopicalProgress(JSON.parse(savedTopical)); } catch (e) { setTopicalProgress([]); }
    } else { setTopicalProgress([]); }

    if (savedTopics) {
      try { setStudyTopics(JSON.parse(savedTopics)); } catch (e) { setStudyTopics([]); }
    } else { setStudyTopics([]); }

    if (savedSubjects) {
      try { setSubjects(JSON.parse(savedSubjects)); } catch (e) { setSubjects(MOCK_SUBJECTS); }
    } else { setSubjects(MOCK_SUBJECTS); }

    if (savedTasks) {
      try { setDailyTasks(JSON.parse(savedTasks)); } catch (e) { setDailyTasks({}); }
    } else { setDailyTasks({}); }

    if (savedStudyTasks) {
      try { setStudyTasks(JSON.parse(savedStudyTasks)); } catch (e) { setStudyTasks([]); }
    } else { setStudyTasks([]); }
  }, [user, getUserKey]);

  // Autosave triggers
  useEffect(() => {
    const key = getUserKey('progress');
    if (key && user) localStorage.setItem(key, JSON.stringify(progress));
  }, [progress, user, getUserKey]);

  useEffect(() => {
    const key = getUserKey('topical');
    if (key && user) localStorage.setItem(key, JSON.stringify(topicalProgress));
  }, [topicalProgress, user, getUserKey]);

  useEffect(() => {
    const key = getUserKey('study_topics');
    if (key && user) localStorage.setItem(key, JSON.stringify(studyTopics));
  }, [studyTopics, user, getUserKey]);

  useEffect(() => {
    const key = getUserKey('subjects');
    if (key && user) localStorage.setItem(key, JSON.stringify(subjects));
  }, [subjects, user, getUserKey]);

  useEffect(() => {
    const key = getUserKey('daily_tasks');
    if (key && user) localStorage.setItem(key, JSON.stringify(dailyTasks));
  }, [dailyTasks, user, getUserKey]);

  useEffect(() => {
    const key = getUserKey('study_tasks');
    if (key && user) localStorage.setItem(key, JSON.stringify(studyTasks));
  }, [studyTasks, user, getUserKey]);

  const handleUpdateProgress = (newProgress: PaperProgress) => {
    setProgress(prev => {
      const existing = prev.findIndex(p => p.paperId === newProgress.paperId);
      if (existing !== -1) {
        const updated = [...prev];
        updated[existing] = { ...updated[existing], ...newProgress };
        return updated;
      }
      return [newProgress, ...prev];
    });
  };

  const toggleDailyTask = (date: string, subjectId: string) => {
    setDailyTasks(prev => {
      const dayTasks = { ...(prev[date] || {}) };
      dayTasks[subjectId] = !dayTasks[subjectId];
      return { ...prev, [date]: dayTasks };
    });
  };

  const handleLogout = useCallback(() => {
    setUser(null);
    setProgress([]);
    setSubjects([]);
    setTopicalProgress([]);
    setStudyTopics([]);
    setDailyTasks({});
    setStudyTasks([]);
    setActiveTab('planner');
    setSelectedSubjectId(null);
  }, []);

  if (!user) return <Auth onLogin={setUser} />;

  const selectedSubject = subjects.find(s => s.id === selectedSubjectId);

  return (
    <Layout 
      activeTab={activeTab} 
      setActiveTab={(tab) => {
        setActiveTab(tab);
        setSelectedSubjectId(null);
      }}
      theme={theme}
      setTheme={setTheme}
      user={user}
      onLogout={handleLogout}
    >
      {selectedSubjectId && selectedSubject ? (
        <SubjectDetail 
          subject={selectedSubject} 
          progress={progress} 
          onUpdateProgress={handleUpdateProgress}
          onBack={() => setSelectedSubjectId(null)}
        />
      ) : activeTab === 'planner' ? (
        <Planner 
          subjects={subjects}
          dailyTasks={dailyTasks}
          onToggleTask={toggleDailyTask}
        />
      ) : activeTab === 'performance' ? (
        <Performance 
          subjects={subjects} 
          progress={progress}
          topicalProgress={topicalProgress} 
        />
      ) : activeTab === 'tracker' ? (
        <StudyTracker 
          subjects={subjects}
          topics={studyTopics}
          onAddTopic={(topic) => setStudyTopics(prev => [...prev, { ...topic, id: Math.random().toString(36).substring(7) }])}
          onUpdateTopic={(topic) => setStudyTopics(prev => prev.map(t => t.id === topic.id ? topic : t))}
          onDeleteTopic={(id) => setStudyTopics(prev => prev.filter(t => t.id !== id))}
          tasks={studyTasks}
          onAddTask={(task) => setStudyTasks(prev => [...prev, { ...task, id: Math.random().toString(36).substring(7) }])}
          onUpdateTask={(task) => setStudyTasks(prev => prev.map(t => t.id === task.id ? task : t))}
          onDeleteTask={(id) => setStudyTasks(prev => prev.filter(t => t.id !== id))}
        />
      ) : activeTab === 'subjects' ? (
        <LogPaperForm 
          subjects={subjects} 
          onLog={handleUpdateProgress} 
        />
      ) : activeTab === 'topical' ? (
        <LogTopicalForm 
          subjects={subjects}
          onLog={(newTopical) => setTopicalProgress(p => [newTopical, ...p])}
        />
      ) : activeTab === 'history' ? (
        <History 
          subjects={subjects}
          progress={progress}
          onDelete={(id) => setProgress(p => p.filter(x => x.paperId !== id))}
        />
      ) : (
        <ManageSubjects 
          subjects={subjects} 
          progress={progress}
          topicalProgress={topicalProgress}
          studyTopics={studyTopics}
          studyTasks={studyTasks}
          dailyTasks={dailyTasks}
          onAddSubject={(s) => setSubjects(p => [...p, s])}
          onUpdateSubject={(s) => setSubjects(p => p.map(x => x.id === s.id ? s : x))}
          onDeleteSubject={(id) => {
            if (confirm("Delete subject and all data?")) {
              setSubjects(p => p.filter(x => x.id !== id));
            }
          }}
          onImport={(data) => {
            setSubjects(data.subjects);
            setProgress(data.progress);
            setTopicalProgress(data.topicalProgress);
            if (data.studyTopics) setStudyTopics(data.studyTopics);
            if (data.studyTasks) setStudyTasks(data.studyTasks);
            if (data.dailyTasks) setDailyTasks(data.dailyTasks);
          }}
        />
      )}
    </Layout>
  );
};

export default App;