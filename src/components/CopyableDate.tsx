'use client';

import React, { useState, useCallback } from 'react';

interface CopyableDateProps {
  date: string;
  className?: string;
}

export default function CopyableDate({ date, className = '' }: CopyableDateProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(date).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    });
  }, [date]);

  return (
    <span
      onClick={handleCopy}
      title="Klik untuk menyalin tanggal"
      className={`group/date relative cursor-pointer select-all rounded px-1.5 py-0.5 font-mono text-sm tabular-nums tracking-wide transition-colors hover:bg-indigo-50 hover:text-indigo-700 active:bg-indigo-100 ${className}`}
    >
      {date}
      {copied && (
        <span className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-slate-800 px-2 py-0.5 text-[10px] font-sans font-medium text-white shadow-lg">
          Tersalin ✓
        </span>
      )}
      {!copied && (
        <svg
          className="ml-1 inline h-3 w-3 text-slate-300 opacity-0 transition-opacity group-hover/date:opacity-100"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      )}
    </span>
  );
}
