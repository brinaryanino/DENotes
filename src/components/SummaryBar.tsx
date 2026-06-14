'use client';

import React, { useMemo } from 'react';
import { useStore } from '@/lib/store';
import { countPending } from '@/lib/types';

export default function SummaryBar() {
  const { selectedPatient } = useStore();

  const pending = useMemo(() => {
    if (!selectedPatient) return null;
    return countPending(selectedPatient);
  }, [selectedPatient]);

  if (!selectedPatient || !pending) return null;

  const totalItems =
    selectedPatient.kiVisits.length +
    selectedPatient.kiaVisits.length +
    selectedPatient.labTests.length +
    selectedPatient.usgTests.length;

  const completedItems = totalItems - pending.total;
  const progressPercent = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 100;
  const allDone = pending.total === 0;

  return (
    <div
      className={`flex-shrink-0 border-t transition-colors duration-300 ${
        allDone ? 'border-emerald-200 bg-emerald-50' : 'border-slate-200 bg-white'
      }`}
    >
      {/* Progress bar */}
      <div className="h-1 w-full bg-slate-100">
        <div
          className={`h-full transition-all duration-500 ease-out ${
            allDone ? 'bg-emerald-500' : progressPercent > 50 ? 'bg-indigo-500' : 'bg-amber-500'
          }`}
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <div className="flex items-center justify-between px-6 py-3">
        {/* Patient name + progress */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            {allDone ? (
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500">
                <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            ) : (
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-100">
                <span className="text-xs font-bold text-amber-700">{pending.total}</span>
              </div>
            )}
            <div>
              <span className="text-sm font-semibold text-slate-800">{selectedPatient.name}</span>
              <span className="ml-2 text-xs text-slate-400">
                {allDone ? '— Semua data sudah masuk!' : `— ${pending.total} entry belum masuk database`}
              </span>
            </div>
          </div>
        </div>

        {/* Detail badges */}
        <div className="flex items-center gap-3">
          <StatusPill label="KI" count={pending.ki} />
          <StatusPill label="KIA" count={pending.kia} />
          <StatusPill label="Lab" count={pending.lab} />
          <StatusPill label="USG" count={pending.usg} />

          <div className="ml-2 h-5 w-px bg-slate-200" />

          <div className="flex items-center gap-1.5">
            <span className="text-xs text-slate-500">{progressPercent}%</span>
            <span className="text-[11px] text-slate-400">selesai</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusPill({ label, count }: { label: string; count: number }) {
  if (count === 0) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 ring-1 ring-emerald-200">
        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
        {label}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-700 ring-1 ring-amber-200">
      <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
      {label}: {count}
    </span>
  );
}
