'use client';

import React from 'react';
import { useAppDispatch } from '@/lib/store';
import { TestLog } from '@/lib/types';
import DateInput from './DateInput';
import CopyableDate from './CopyableDate';

interface TestSectionProps {
  patientId: string;
  testType: 'lab' | 'usg';
  tests: TestLog[];
  inputId: string;
}

export default function TestSection({ patientId, testType, tests, inputId }: TestSectionProps) {
  const dispatch = useAppDispatch();

  const title = testType === 'lab' ? 'Tes Lab' : 'Tes USG';
  const icon =
    testType === 'lab' ? (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
      </svg>
    ) : (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    );

  const pendingCount = tests.filter((t) => t.status === 'pending').length;

  const handleAddTest = (date: string) => {
    dispatch({ type: 'ADD_TEST', payload: { patientId, testType, date } });
  };

  const handleRemoveTest = (testId: string) => {
    dispatch({ type: 'REMOVE_TEST', payload: { patientId, testType, testId } });
  };

  const handleToggleStatus = (testId: string) => {
    dispatch({ type: 'TOGGLE_TEST_STATUS', payload: { patientId, testType, testId } });
  };

  const sortedTests = [...tests].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3.5">
        <div className="flex items-center gap-2">
          <span className="text-slate-500">{icon}</span>
          <h3 className="text-sm font-bold text-slate-800">{title}</h3>
        </div>
        {pendingCount > 0 && (
          <span className="inline-flex items-center rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-700 ring-1 ring-amber-200">
            {pendingCount} pending
          </span>
        )}
      </div>

      {/* Add Input */}
      <div className="border-b border-slate-100 px-5 py-3">
        <div className="flex gap-2">
          <DateInput id={inputId} onSubmit={handleAddTest} />
          <span className="flex-shrink-0 self-center text-[10px] text-slate-400">Enter ↵</span>
        </div>
      </div>

      {/* Test List */}
      <div className="max-h-48 overflow-y-auto">
        {sortedTests.length === 0 ? (
          <div className="px-5 py-5 text-center">
            <p className="text-xs text-slate-400">Belum ada catatan {testType === 'lab' ? 'tes lab' : 'tes USG'}</p>
          </div>
        ) : (
          <ul className="divide-y divide-slate-100">
            {sortedTests.map((test) => {
              const isPending = test.status === 'pending';
              return (
                <li
                  key={test.id}
                  className={`group flex items-center justify-between px-5 py-2.5 transition-colors ${
                    isPending ? 'bg-white' : 'bg-emerald-50/30'
                  }`}
                >
                  <CopyableDate
                    date={test.date}
                    className={isPending ? 'font-medium text-slate-700' : 'text-slate-500'}
                  />

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleStatus(test.id)}
                      onKeyDown={(e) => {
                        if (e.key === ' ') {
                          e.preventDefault();
                          handleToggleStatus(test.id);
                        }
                      }}
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 ${
                        isPending
                          ? 'bg-amber-50 text-amber-700 ring-1 ring-amber-200 hover:bg-amber-100 focus:ring-amber-400'
                          : 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 hover:bg-emerald-100 focus:ring-emerald-400'
                      }`}
                      title={isPending ? 'Tandai sudah masuk database' : 'Tandai belum masuk database'}
                    >
                      {isPending ? (
                        <>
                          <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                          Belum
                        </>
                      ) : (
                        <>
                          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                          Sudah
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => handleRemoveTest(test.id)}
                      className="rounded p-0.5 text-slate-400 opacity-0 transition-opacity hover:text-rose-500 group-hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-1 focus:ring-rose-400"
                      title="Hapus"
                    >
                      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
