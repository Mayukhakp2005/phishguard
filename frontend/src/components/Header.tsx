import React from 'react';
import { Shield, ChevronDown } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="w-full max-w-7xl mx-auto px-6 pt-6 pb-2">
      <nav className="glass-header rounded-2xl px-6 py-3.5 flex items-center justify-between shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
            <Shield className="w-5 h-5 fill-indigo-400/20" />
          </div>
          <span className="text-xl font-bold text-white tracking-tight">PhishGuard</span>
        </div>

        <div className="flex items-center gap-8 text-sm font-medium">
          <button className="relative py-1 text-white font-semibold">
            Dashboard
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.8)]"></span>
          </button>
          <button className="text-slate-400 hover:text-slate-200 transition-colors">History</button>
          <button className="text-slate-400 hover:text-slate-200 transition-colors">Reports</button>
          <button className="text-slate-400 hover:text-slate-200 transition-colors">Settings</button>
        </div>

        <div className="flex items-center gap-2 cursor-pointer group">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 to-blue-500 p-0.5">
            <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-xs font-semibold text-white">
              JD
            </div>
          </div>
          <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
        </div>
      </nav>
    </header>
  );
};
