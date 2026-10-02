import React from 'react';
import { HelpCircle, CheckCircle2, AlertTriangle, Check } from 'lucide-react';
import { PredictionResponsePayload } from '../services/api';

interface RecommendationsCardProps {
  predictionData: PredictionResponsePayload;
}

export const RecommendationsCard: React.FC<RecommendationsCardProps> = ({ predictionData }) => {
  const { prediction } = predictionData;

  const isSafe = prediction === 'SAFE';
  const isSuspicious = prediction === 'SUSPICIOUS';

  return (
    <div className="glass-card rounded-2xl p-6 flex flex-col justify-between h-full">
      <div className="flex items-center gap-2 mb-4">
        <HelpCircle className="w-5 h-5 text-indigo-400" />
        <h3 className="text-sm font-bold text-white tracking-tight">Security Recommendations</h3>
      </div>

      <div className="space-y-4 my-auto">
        <div className="glass-card rounded-xl p-4 bg-slate-900/80 border-slate-800 flex items-start gap-4">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border ${
            isSafe ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' :
            isSuspicious ? 'bg-amber-500/20 text-amber-400 border-amber-500/40' :
            'bg-red-500/20 text-red-400 border-red-500/40'
          }`}>
            {isSafe ? <CheckCircle2 className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
          </div>

          <div>
            <h4 className="text-sm font-bold text-white tracking-tight">
              {isSafe ? 'No immediate action required.' :
               isSuspicious ? 'Exercise caution before proceeding.' :
               'High risk phishing threat!'}
            </h4>
            <p className="mt-1 text-xs text-slate-300 font-normal leading-relaxed">
              {isSafe ? 'This URL appears to be safe. Continue browsing with confidence.' :
               isSuspicious ? 'This URL displays structural anomalies. Do not enter credentials.' :
               'Avoid visiting this URL or entering personal information.'}
            </p>
          </div>
        </div>

        <div className="space-y-2.5 pt-2">
          <span className="block text-xs font-semibold text-slate-400">For continued safety:</span>
          <div className="space-y-2">
            <div className="flex items-center gap-2.5 text-xs text-slate-300">
              <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Be cautious with unexpected links or attachments.</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-slate-300">
              <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Keep your browser and security software up to date.</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-slate-300">
              <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Verify sensitive requests, even if they seem legitimate.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
