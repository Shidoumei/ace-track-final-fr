
import React, { useState } from 'react';

interface AuthProps {
  onLogin: (user: { name: string; email: string }) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API delay
    setTimeout(() => {
      onLogin({ 
        name: isLogin ? 'Academic Student' : name, 
        email: email 
      });
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl shadow-blue-500/10 border border-slate-100 dark:border-slate-800 p-10 space-y-8 animate-in zoom-in-95 duration-500">
        <div className="text-center">
          <div className="bg-blue-600 w-16 h-16 rounded-3xl flex items-center justify-center text-white text-3xl mx-auto mb-6 shadow-xl shadow-blue-200 dark:shadow-none">
            <i className="fas fa-graduation-cap"></i>
          </div>
          <h1 className="text-3xl font-black text-slate-800 dark:text-slate-100 tracking-tight">
            {isLogin ? 'Welcome Back' : 'Join AceTrack'}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">
            {isLogin ? 'Sign in to sync your exam progress' : 'Start tracking your path to top grades'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLogin && (
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-2">Full Name</label>
              <input 
                type="text" 
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-6 py-4 text-slate-700 dark:text-slate-200 font-bold outline-none focus:ring-4 focus:ring-blue-500/5 transition-all"
                placeholder="John Doe"
              />
            </div>
          )}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-2">Email Address</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-6 py-4 text-slate-700 dark:text-slate-200 font-bold outline-none focus:ring-4 focus:ring-blue-500/5 transition-all"
              placeholder="student@example.com"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-2">Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-6 py-4 text-slate-700 dark:text-slate-200 font-bold outline-none focus:ring-4 focus:ring-blue-500/5 transition-all"
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-5 rounded-2xl shadow-xl shadow-blue-500/20 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50 mt-4"
          >
            {loading ? <i className="fas fa-spinner fa-spin"></i> : (isLogin ? 'Sign In' : 'Create Account')}
          </button>
        </form>

        <div className="text-center pt-4">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="ml-2 text-blue-600 dark:text-blue-400 font-bold hover:underline"
            >
              {isLogin ? 'Register' : 'Login'}
            </button>
          </p>
        </div>

        <div className="flex items-center gap-4 py-2">
          <div className="flex-1 h-px bg-slate-100 dark:bg-slate-800"></div>
          <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Or Continue As</span>
          <div className="flex-1 h-px bg-slate-100 dark:bg-slate-800"></div>
        </div>

        <button 
          onClick={() => onLogin({ name: 'Guest User', email: 'guest@acetrack.com' })}
          className="w-full bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold py-4 rounded-2xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all"
        >
          Guest Session
        </button>
      </div>
    </div>
  );
};

export default Auth;
