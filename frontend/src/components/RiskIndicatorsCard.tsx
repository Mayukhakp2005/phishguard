import React from 'react';
import { Shield, Lock, Calendar, MapPin, Code, Repeat, ChevronRight } from 'lucide-react';
import { PredictionResponsePayload } from '../services/api';

interface RiskIndicatorsCardProps {
  predictionData: PredictionResponsePayload;
}

export const RiskIndicatorsCard: React.FC<RiskIndicatorsCardProps> = ({ predictionData }) => {
  const { url, indicators } = predictionData;

  const isHttps = url.toLowerCase().startsWith('https');

  const indicatorItems = [
    {
      icon: <Shield className="w-4 h-4 text-slate-400" />,
      label: 'URL Length',
      status: url.length > 75 ? 'Excessive' : 'Normal',
      statusColor: url.length > 75 ? 'text-red-400' : 'text-emerald-400',
      dotColor: url.length > 75 ? 'bg-red-400' : 'bg-emerald-400',
    },
    {
      icon: <Lock className="w-4 h-4 text-slate-400" />,
      label: 'HTTPS Protocol',
      status: isHttps ? 'Secure' : 'Unencrypted',
      statusColor: isHttps ? 'text-emerald-400' : 'text-red-400',
      dotColor: isHttps ? 'bg-emerald-400' : 'bg-red-400',
    },
    {
      icon: <Calendar className="w-4 h-4 text-slate-400" />,
      label: 'Subdomain Structure',
      status: indicators.some((item) => item.includes('subdomain')) ? 'Multiple' : 'Normal',
      statusColor: indicators.some((item) => item.includes('subdomain')) ? 'text-amber-400' : 'text-emerald-400',
      dotColor: indicators.some((item) => item.includes('subdomain')) ? 'bg-amber-400' : 'bg-emerald-400',
    },
    {
      icon: <MapPin className="w-4 h-4 text-slate-400" />,
      label: 'IP-based Hostname',
      status: indicators.some((item) => item.includes('IP address')) ? 'Yes' : 'No',
      statusColor: indicators.some((item) => item.includes('IP address')) ? 'text-red-400' : 'text-emerald-400',
      dotColor: indicators.some((item) => item.includes('IP address')) ? 'bg-red-400' : 'bg-emerald-400',
    },
    {
      icon: <Code className="w-4 h-4 text-slate-400" />,
      label: 'Special Characters',
      status: indicators.some((item) => item.includes('digit') || item.includes('delimiter')) ? 'High' : 'None',
      statusColor: indicators.some((item) => item.includes('digit') || item.includes('delimiter')) ? 'text-amber-400' : 'text-emerald-400',
      dotColor: indicators.some((item) => item.includes('digit') || item.includes('delimiter')) ? 'bg-amber-400' : 'bg-emerald-400',
    },
    {
      icon: <Repeat className="w-4 h-4 text-slate-400" />,
      label: 'Obfuscation Pattern',
      status: indicators.some((item) => item.includes('obfuscation')) ? 'Detected' : 'Normal',
      statusColor: indicators.some((item) => item.includes('obfuscation')) ? 'text-red-400' : 'text-emerald-400',
      dotColor: indicators.some((item) => item.includes('obfuscation')) ? 'bg-red-400' : 'bg-emerald-400',
    },
  ];

  return (
    <div className="glass-card rounded-2xl p-6 flex flex-col justify-between h-full">
      <div className="flex items-center gap-2 mb-4">
        <Shield className="w-5 h-5 text-indigo-400" />
        <h3 className="text-sm font-bold text-white tracking-tight">Risk Indicators</h3>
      </div>

      <div className="space-y-2.5 my-auto">
        {indicatorItems.map((item, index_number) => (
          <div
            key={index_number}
            className="glass-card rounded-xl p-3 flex items-center justify-between bg-slate-900/60 border-slate-800 hover:border-slate-700/80 transition-all cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-slate-800/80 border border-slate-700/50 flex items-center justify-center shrink-0">
                {item.icon}
              </div>
              <span className="text-xs font-medium text-slate-200">{item.label}</span>
            </div>

            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${item.dotColor} shadow-[0_0_8px_currentColor]`}></span>
              <span className={`text-xs font-semibold ${item.statusColor}`}>{item.status}</span>
              <ChevronRight className="w-4 h-4 text-slate-600 ml-1" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
