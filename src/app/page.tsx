'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Dashboard from '@/components/Dashboard';
import SummaryBar from '@/components/SummaryBar';
import KeyboardShortcutsHelp from '@/components/KeyboardShortcutsHelp';

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar with animated width */}
        <div
          className={`flex-shrink-0 transition-all duration-300 ease-in-out ${
            sidebarOpen ? 'w-72' : 'w-0'
          } overflow-hidden`}
        >
          <Sidebar />
        </div>

        {/* Toggle button */}
        <button
          onClick={() => setSidebarOpen((prev) => !prev)}
          title={sidebarOpen ? 'Sembunyikan sidebar (Ctrl+B)' : 'Tampilkan sidebar (Ctrl+B)'}
          className="relative z-10 flex h-full w-5 flex-shrink-0 items-center justify-center border-r border-slate-200 bg-slate-100 text-slate-400 transition-colors hover:bg-slate-200 hover:text-slate-600 focus:outline-none focus:ring-1 focus:ring-inset focus:ring-indigo-500"
        >
          <svg
            className={`h-3.5 w-3.5 transition-transform duration-300 ${sidebarOpen ? '' : 'rotate-180'}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <Dashboard />
      </div>
      <SummaryBar />
      <KeyboardShortcutsHelp onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />
    </div>
  );
}
