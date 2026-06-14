'use client';

import React from 'react';
import { useStore } from '@/lib/store';
import VisitColumn from './VisitColumn';
import TestSection from './TestSection';

export default function Dashboard() {
  const { selectedPatient } = useStore();

  if (!selectedPatient) {
    return (
      <div className="flex flex-1 items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-slate-100">
            <svg className="h-10 w-10 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          </div>
          <h2 className="mb-2 text-lg font-semibold text-slate-700">Pilih Pasien</h2>
          <p className="max-w-xs text-sm text-slate-400">
            Pilih pasien dari daftar di sebelah kiri untuk mulai mengelola data kunjungan dan tes.
          </p>
          <div className="mt-6 flex flex-col items-center gap-2">
            <div className="flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-2 text-xs text-slate-500">
              <kbd className="rounded bg-white px-1.5 py-0.5 font-mono text-[10px] shadow-sm">↑</kbd>
              <kbd className="rounded bg-white px-1.5 py-0.5 font-mono text-[10px] shadow-sm">↓</kbd>
              <span>untuk navigasi daftar pasien</span>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-2 text-xs text-slate-500">
              <kbd className="rounded bg-white px-1.5 py-0.5 font-mono text-[10px] shadow-sm">Enter</kbd>
              <span>untuk memilih pasien</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden bg-slate-50">
      {/* Patient Header */}
      <div className="flex-shrink-0 border-b border-slate-200 bg-white px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-600">
            {selectedPatient.name
              .split(' ')
              .map((n) => n[0])
              .slice(0, 2)
              .join('')
              .toUpperCase()}
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-800">{selectedPatient.name}</h2>
            <p className="text-xs text-slate-500">
              ID: {selectedPatient.id.slice(-8).toUpperCase()} · Data Kunjungan &amp; Tes
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {/* Visit Columns - Side by Side */}
        <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <VisitColumn
            patientId={selectedPatient.id}
            column="ki"
            visits={selectedPatient.kiVisits}
            inputId="ki-date-input"
          />
          <VisitColumn
            patientId={selectedPatient.id}
            column="kia"
            visits={selectedPatient.kiaVisits}
            inputId="kia-date-input"
          />
        </div>

        {/* Test Sections */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <TestSection
            patientId={selectedPatient.id}
            testType="lab"
            tests={selectedPatient.labTests}
            inputId="lab-date-input"
          />
          <TestSection
            patientId={selectedPatient.id}
            testType="usg"
            tests={selectedPatient.usgTests}
            inputId="usg-date-input"
          />
        </div>
      </div>
    </div>
  );
}
