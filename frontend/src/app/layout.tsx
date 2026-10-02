import React from 'react';
import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'PhishGuard - Machine Learning Phishing URL Detection',
  description: 'Analyze URLs for phishing and security risks before you click with real-time risk scoring and explainable security indicators.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#080C14] text-slate-100 font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
