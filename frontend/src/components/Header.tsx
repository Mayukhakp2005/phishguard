import React from 'react';
import { Shield } from 'lucide-react';

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

        <div className="flex items-center text-sm font-medium">
          <button className="relative py-1 text-white font-semibold">
            Dashboard
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.8)]"></span>
          </button>
        </div>
      </nav>
    </header>
  );
};
