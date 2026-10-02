import React from 'react';
import { Link2, Lock, Globe, Clock } from 'lucide-react';
import { PredictionResponsePayload } from '../services/api';

interface UrlDetailsCardProps {
  predictionData: PredictionResponsePayload;
}

export const UrlDetailsCard: React.FC<UrlDetailsCardProps> = ({ predictionData }) => {
  const { url } = predictionData;

  const extractHostDomain = (url_string: string) => {
    try {
      const parsed_url = new URL(url_string.startsWith('http') ? url_string : `http://${url_string}`);
      return parsed_url.hostname;
    } catch {
      return url_string;
    }
  };

  const isHttpsProtocol = url.toLowerCase().startsWith('https');
  const domain_name = extractHostDomain(url);

  return (
    <div className="glass-card rounded-2xl p-6 flex flex-col justify-between h-full">
      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">URL Details</h3>

      <div className="space-y-3.5 my-auto">
        <div className="glass-card rounded-xl p-3.5 flex items-center gap-3.5 bg-slate-900/60 border-slate-800">
          <div className="w-9 h-9 rounded-xl bg-slate-800/80 border border-slate-700/50 flex items-center justify-center text-slate-400 shrink-0">
            <Link2 className="w-4 h-4" />
          </div>
          <div className="overflow-hidden">
            <span className="block text-[11px] font-semibold text-slate-400 uppercase">Analyzed URL</span>
            <span className="block text-sm font-medium text-white truncate" title={url}>{url}</span>
          </div>
        </div>

        <div className="glass-card rounded-xl p-3.5 flex items-center gap-3.5 bg-slate-900/60 border-slate-800">
          <div className="w-9 h-9 rounded-xl bg-slate-800/80 border border-slate-700/50 flex items-center justify-center text-slate-400 shrink-0">
            <Lock className="w-4 h-4" />
          </div>
          <div>
            <span className="block text-[11px] font-semibold text-slate-400 uppercase">HTTPS</span>
            <span className={`block text-sm font-semibold ${isHttpsProtocol ? 'text-emerald-400' : 'text-red-400'}`}>
              {isHttpsProtocol ? 'Enabled' : 'Disabled'}
            </span>
          </div>
        </div>

        <div className="glass-card rounded-xl p-3.5 flex items-center gap-3.5 bg-slate-900/60 border-slate-800">
          <div className="w-9 h-9 rounded-xl bg-slate-800/80 border border-slate-700/50 flex items-center justify-center text-slate-400 shrink-0">
            <Globe className="w-4 h-4" />
          </div>
          <div className="overflow-hidden">
            <span className="block text-[11px] font-semibold text-slate-400 uppercase">Domain</span>
            <span className="block text-sm font-medium text-white truncate">{domain_name}</span>
          </div>
        </div>

        <div className="glass-card rounded-xl p-3.5 flex items-center gap-3.5 bg-slate-900/60 border-slate-800">
          <div className="w-9 h-9 rounded-xl bg-slate-800/80 border border-slate-700/50 flex items-center justify-center text-slate-400 shrink-0">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <span className="block text-[11px] font-semibold text-slate-400 uppercase">Scan time</span>
            <span className="block text-sm font-medium text-white">0.01 seconds</span>
          </div>
        </div>
      </div>
    </div>
  );
};
