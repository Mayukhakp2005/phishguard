import React, { useState } from 'react';
import { Link2, ArrowRight, Loader2 } from 'lucide-react';

interface HeroSearchProps {
  onAnalyzeUrlAction: (target_url_string: string) => void;
  isLoadingState: boolean;
}

export const HeroSearch: React.FC<HeroSearchProps> = ({ onAnalyzeUrlAction, isLoadingState }) => {
  const [inputUrlString, setInputUrlString] = useState<string>('');

  const handleSubmitForm = (event_object: React.FormEvent) => {
    event_object.preventDefault();
    const trimmed_input = inputUrlString.trim();
    if (trimmed_input.length > 0) {
      onAnalyzeUrlAction(trimmed_input);
    }
  };

  return (
    <section className="w-full max-w-4xl mx-auto px-6 pt-12 pb-8 text-left">
      <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
        Know what&apos;s behind <br />
        <span className="gradient-text">every link.</span>
      </h1>
      <p className="mt-3 text-slate-400 text-base sm:text-lg max-w-lg font-normal">
        Analyze URLs for phishing and security risks before you click.
      </p>

      <form onSubmit={handleSubmitForm} className="mt-8 w-full">
        <div className="glass-card rounded-2xl p-2.5 flex items-center gap-3 border border-slate-700/50 shadow-2xl focus-within:border-blue-500/60 transition-all">
          <div className="pl-3 text-slate-400">
            <Link2 className="w-5 h-5" />
          </div>

          <input
            type="text"
            value={inputUrlString}
            onChange={(event_element) => setInputUrlString(event_element.target.value)}
            placeholder="Paste a URL to analyze..."
            className="w-full bg-transparent text-white placeholder-slate-500 focus:outline-none text-base font-normal"
            disabled={isLoadingState}
          />

          <button
            type="submit"
            disabled={isLoadingState || inputUrlString.trim().length === 0}
            className="glow-btn shrink-0 rounded-xl px-6 py-3 text-white font-medium text-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isLoadingState ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                Analyze URL
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </section>
  );
};
