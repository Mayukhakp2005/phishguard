'use client';

import React, { useState } from 'react';
import { Header } from '../components/Header';
import { HeroSearch } from '../components/HeroSearch';
import { RiskScoreCard } from '../components/RiskScoreCard';
import { UrlDetailsCard } from '../components/UrlDetailsCard';
import { RiskIndicatorsCard } from '../components/RiskIndicatorsCard';
import { RecommendationsCard } from '../components/RecommendationsCard';
import { requestUrlPrediction, PredictionResponsePayload } from '../services/api';

export default function HomePage() {
  const [predictionData, setPredictionData] = useState<PredictionResponsePayload | null>({
    url: 'example.com',
    prediction: 'SAFE',
    risk_score: 18,
    confidence: 94.7,
    indicators: ['No suspicious URL structure indicators detected']
  });

  const [isLoadingState, setIsLoadingState] = useState<boolean>(false);
  const [errorMessageState, setErrorMessageState] = useState<string | null>(null);

  const handleAnalyzeUrl = async (target_url_string: string) => {
    setIsLoadingState(true);
    setErrorMessageState(null);

    try {
      const response_data = await requestUrlPrediction(target_url_string);
      setPredictionData(response_data);
    } catch (error_instance: unknown) {
      if (error_instance instanceof Error) {
        setErrorMessageState(error_instance.message);
      } else {
        setErrorMessageState('Failed to process URL prediction request');
      }
    } finally {
      setIsLoadingState(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080C14] text-slate-100 flex flex-col justify-between pb-16 selection:bg-blue-500 selection:text-white">
      <div>
        <Header />

        <main className="w-full max-w-7xl mx-auto px-6">
          <HeroSearch onAnalyzeUrlAction={handleAnalyzeUrl} isLoadingState={isLoadingState} />

          {errorMessageState && (
            <div className="w-full max-w-4xl mx-auto mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-medium flex items-center justify-between">
              <span>{errorMessageState}</span>
              <button
                onClick={() => setErrorMessageState(null)}
                className="text-xs font-bold uppercase tracking-wider underline hover:text-red-300"
              >
                Dismiss
              </button>
            </div>
          )}

          {predictionData && (
            <div className="mt-8 space-y-6 max-w-6xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-7">
                  <RiskScoreCard predictionData={predictionData} />
                </div>
                <div className="lg:col-span-5">
                  <UrlDetailsCard predictionData={predictionData} />
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-6">
                  <RiskIndicatorsCard predictionData={predictionData} />
                </div>
                <div className="lg:col-span-6">
                  <RecommendationsCard predictionData={predictionData} />
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      <footer className="w-full max-w-7xl mx-auto px-6 mt-16 pt-6 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500 font-medium">
        <span>© 2026 PhishGuard Platform. All rights reserved.</span>
        <span>Machine Learning Phishing Prevention Engine</span>
      </footer>
    </div>
  );
}
