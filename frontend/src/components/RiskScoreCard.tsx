import React from 'react';
import { ShieldCheck, ShieldAlert, ShieldX } from 'lucide-react';
import { PredictionResponsePayload } from '../services/api';

interface RiskScoreCardProps {
  predictionData: PredictionResponsePayload;
}

export const RiskScoreCard: React.FC<RiskScoreCardProps> = ({ predictionData }) => {
  const { prediction, risk_score, confidence } = predictionData;

  const strokeDashoffsetValue = 283 - (283 * risk_score) / 100;

  const getBadgeStyle = () => {
    if (prediction === 'SAFE') {
      return {
        badgeBg: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
        strokeColor: '#10B981',
        icon: <ShieldCheck className="w-6 h-6 text-emerald-400" />,
        iconBg: 'bg-emerald-500/20 border-emerald-500/30',
        title: 'Why this URL is safe?',
        description: 'The domain is legitimate, uses HTTPS, and shows no signs of malicious activity or suspicious behavior.',
      };
    }
    if (prediction === 'SUSPICIOUS') {
      return {
        badgeBg: 'bg-amber-500/20 text-amber-400 border-amber-500/40',
        strokeColor: '#F59E0B',
        icon: <ShieldAlert className="w-6 h-6 text-amber-400" />,
        iconBg: 'bg-amber-500/20 border-amber-500/30',
        title: 'Why this URL is suspicious?',
        description: 'The URL exhibits structural warning signs or abnormal character ratios requiring additional caution.',
      };
    }
    return {
      badgeBg: 'bg-red-500/20 text-red-400 border-red-500/40',
      strokeColor: '#EF4444',
      icon: <ShieldX className="w-6 h-6 text-red-400" />,
      iconBg: 'bg-red-500/20 border-red-500/30',
      title: 'Why this URL is dangerous?',
      description: 'Strong phishing indicators detected such as credential redirects, IP hostnames, or severe URL obfuscation.',
    };
  };

  const styleConfig = getBadgeStyle();

  return (
    <div className="glass-card rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between h-full">
      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Risk Score</h3>

      <div className="flex flex-col md:flex-row items-center gap-8 my-auto">
        <div className="relative flex flex-col items-center justify-center shrink-0">
          <svg className="w-48 h-48 score-gauge-ring" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              className="text-slate-800"
              strokeWidth="6"
              stroke="currentColor"
              fill="transparent"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              strokeWidth="6"
              stroke={styleConfig.strokeColor}
              fill="transparent"
              strokeDasharray="283"
              strokeDashoffset={strokeDashoffsetValue}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-4xl font-extrabold text-white tracking-tight">{risk_score}</span>
            <span className="text-xs font-semibold text-slate-400 mt-0.5">/ 100</span>

            <div className={`mt-2 px-3 py-0.5 rounded-full text-xs font-bold border flex items-center gap-1.5 ${styleConfig.badgeBg}`}>
              <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
              {prediction}
            </div>
          </div>

          <p className="mt-4 text-xs font-medium text-slate-400">{confidence}% Confidence</p>
        </div>

        <div className="hidden md:block w-px h-32 bg-slate-800/80"></div>

        <div className="flex-1 flex items-start gap-4">
          <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center shrink-0 ${styleConfig.iconBg}`}>
            {styleConfig.icon}
          </div>
          <div>
            <h4 className="text-lg font-bold text-white tracking-tight">{styleConfig.title}</h4>
            <p className="mt-2 text-sm text-slate-300 leading-relaxed font-normal">{styleConfig.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
