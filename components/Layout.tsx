
import React, { useState, useEffect } from 'react';
import { ThemeMode } from '../App';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: 'performance' | 'subjects' | 'topical' | 'manage' | 'history' | 'planner' | 'tracker';
  setActiveTab: (tab: 'performance' | 'subjects' | 'topical' | 'manage' | 'history' | 'planner' | 'tracker') => void;
  theme: ThemeMode;
  setTheme: (val: ThemeMode) => void;
  user: { name: string; email: string };
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab, theme, setTheme, user, onLogout }) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [savePulse, setSavePulse] = useState(false);

  // Trigger a subtle pulse whenever the children change (indicating a potential state update)
  useEffect(() => {
    setSavePulse(true);
    const timer = setTimeout(() => setSavePulse(false), 1000);
    return () => clearTimeout(timer);
  }, [children]);

  const cycleTheme = () => {
    if (theme === 'light') setTheme('dark');
    else if (theme === 'dark') setTheme('gold');
    else setTheme('light');
  };

  const getThemeIcon = () => {
    if (theme === 'light') return 'fa-sun';
    if (theme === 'dark') return 'fa-moon';
    return 'fa-crown';
  };

  return (
    <div className={`min-h-screen flex flex-col md:flex-row bg-[#F8FAFC] dark:bg-slate-950 transition-colors duration-300 ${theme === 'gold' ? 'theme-gold' : ''}`}>
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex-shrink-0 transition-colors flex flex-col z-20">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-10">
            <div className="bg-blue-600 w-10 h-10 rounded-xl flex items-center justify-center text-white text-xl shadow-lg shadow-blue-100 dark:shadow-none">
              <i className="fas fa-graduation-cap"></i>
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-800 dark:text-slate-100">AceTrack</h1>
              <p className="text-[9px] font-black text-blue-500 dark:text-blue-400 uppercase tracking-widest leading-none mt-1">made by Saad Khan</p>
            </div>
          </div>
          
          <nav className="space-y-2">
            <NavItem 
              icon="fa-calendar-check" 
              label="Daily PPQ" 
              active={activeTab === 'planner'} 
              onClick={() => setActiveTab('planner')} 
            />
            <NavItem 
              icon="fa-table-cells-large" 
              label="Performance" 
              active={activeTab === 'performance'} 
              onClick={() => setActiveTab('performance')} 
            />
            <NavItem 
              icon="fa-list-check" 
              label="Study Tracker" 
              active={activeTab === 'tracker'} 
              onClick={() => setActiveTab('tracker')} 
            />
            <NavItem 
              icon="fa-file-lines" 
              label="Log Past Paper" 
              active={activeTab === 'subjects'} 
              onClick={() => setActiveTab('subjects')} 
            />
            <NavItem 
              icon="fa-layer-group" 
              label="Log Topical" 
              active={activeTab === 'topical'} 
              onClick={() => setActiveTab('topical')} 
            />
            <NavItem 
              icon="fa-clock-rotate-left" 
              label="History" 
              active={activeTab === 'history'} 
              onClick={() => setActiveTab('history')} 
            />
            <NavItem 
              icon="fa-window-maximize" 
              label="Manage Subjects" 
              active={activeTab === 'manage'} 
              onClick={() => setActiveTab('manage')} 
            />
          </nav>
        </div>
        
        <div className="mt-auto p-6 space-y-4">
          <button 
            onClick={(e) => {
              e.preventDefault();
              onLogout();
            }}
            className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-slate-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all group"
          >
            <i className="fas fa-right-from-bracket text-lg group-hover:scale-110 transition-transform"></i>
            <span className="text-sm font-bold">Sign Out</span>
          </button>
          
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-4 border border-blue-100 dark:border-blue-900/30">
            <p className="text-[10px] font-bold text-blue-500 dark:text-blue-400 uppercase tracking-widest mb-1">Study Tip</p>
            <p className="text-xs text-blue-800 dark:text-blue-200 leading-snug">Reviewing your history helps identify recurring weaknesses!</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className="bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 px-8 py-5 sticky top-0 z-10 flex justify-between items-center transition-colors">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">
              {activeTab === 'planner' ? 'Daily PPQ' :
               activeTab === 'performance' ? 'Performance Insights' : 
               activeTab === 'tracker' ? 'Topical Todo List' :
               activeTab === 'subjects' ? 'Log Past Paper' : 
               activeTab === 'topical' ? 'Log Topical Revision' :
               activeTab === 'history' ? 'Past Paper History' :
               'Manage Subjects'}
            </h2>
            <div className={`hidden lg:flex items-center gap-2 px-3 py-1 bg-emerald-50 dark:bg-emerald-900/20 rounded-full border border-emerald-100 dark:border-emerald-900/30 transition-all duration-500 ${savePulse ? 'scale-105 border-emerald-400' : 'opacity-80'}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${savePulse ? 'bg-emerald-400' : 'bg-emerald-500'} animate-pulse`}></span>
              <span className="text-[9px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
                {savePulse ? 'Saving...' : 'Synced'}
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={cycleTheme}
              className={`p-2 w-10 h-10 rounded-xl flex items-center justify-center transition-all border ${
                theme === 'gold' 
                  ? 'bg-gold/10 text-gold border-gold/30 hover:bg-gold/20' 
                  : 'bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
              title={`Theme: ${theme}`}
            >
              <i className={`fas ${getThemeIcon()}`}></i>
            </button>
            
            <div className="relative">
              <button 
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-3 p-1.5 pr-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group"
              >
                <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 font-bold text-sm shadow-sm group-hover:border-blue-200 dark:group-hover:border-blue-800 transition-all">
                  {user.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="hidden sm:block text-right">
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-100 leading-tight">{user.name}</p>
                  <p className="text-[10px] text-slate-400 leading-tight">Account Settings</p>
                </div>
                <i className={`fas fa-chevron-down text-[10px] text-slate-400 transition-transform ${showProfileMenu ? 'rotate-180' : ''}`}></i>
              </button>

              {showProfileMenu && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setShowProfileMenu(false)}
                  ></div>
                  <div className="absolute right-0 mt-3 w-56 bg-white dark:bg-slate-900 rounded-[1.5rem] shadow-2xl border border-slate-100 dark:border-slate-800 py-3 z-50 animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                    <div className="px-5 py-2 mb-2 border-b border-slate-50 dark:border-slate-800">
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-100">{user.name}</p>
                      <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
                    </div>
                    <button 
                      onClick={() => {
                        setShowProfileMenu(false);
                        onLogout();
                      }}
                      className="w-full flex items-center gap-3 px-5 py-3 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors font-bold"
                    >
                      <i className="fas fa-right-from-bracket"></i>
                      Sign Out
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>
        
        <div className="p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

const NavItem = ({ icon, label, active, onClick }: { icon: string, label: string, active: boolean, onClick: () => void }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group ${
      active 
        ? 'bg-blue-600 text-white font-bold shadow-xl shadow-blue-200 dark:shadow-none' 
        : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
    }`}
  >
    <i className={`fas ${icon} text-lg ${active ? 'text-white' : 'text-slate-300 dark:text-slate-600 group-hover:text-blue-400 dark:group-hover:text-blue-500'}`}></i>
    <span className="text-sm">{label}</span>
  </button>
);

export default Layout;