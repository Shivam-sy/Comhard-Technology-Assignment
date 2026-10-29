import React from 'react';
import { Loader2 } from 'lucide-react';

export function LoadingSpinner({ text = 'Loading data...', fullPage = false }) {
  if (fullPage) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-freshdesk-600 animate-spin" />
        <p className="text-sm text-slate-500 font-medium">{text}</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-8 gap-2.5 text-slate-500">
      <Loader2 className="w-5 h-5 text-freshdesk-600 animate-spin" />
      <span className="text-sm font-medium">{text}</span>
    </div>
  );
}

export default LoadingSpinner;
