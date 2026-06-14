'use client';

import Sidebar from '@/components/Sidebar';
import Dashboard from '@/components/Dashboard';
import SummaryBar from '@/components/SummaryBar';
import KeyboardShortcutsHelp from '@/components/KeyboardShortcutsHelp';

export default function Home() {
  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <Dashboard />
      </div>
      <SummaryBar />
      <KeyboardShortcutsHelp />
    </div>
  );
}
