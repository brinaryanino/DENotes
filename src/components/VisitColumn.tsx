'use client';

import React, { useState, useRef } from 'react';
import { useAppDispatch } from '@/lib/store';
import { Visit, formatDate } from '@/lib/types';

interface VisitColumnProps {
  patientId: string;
  column: 'ki' | 'kia';
  visits: Visit[];
  inputId: string;
}

export default function VisitColumn({ patientId, column, visits, inputId }: VisitColumnProps) {
  const dispatch = useAppDispatch();
  const [dateValue, setDateValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const title = column === 'ki' ? 'Kunjungan KI' : 'Kunjungan KIA';
  const subtitle = column === 'ki' ? 'Kesehatan Ibu' : 'Kesehatan Ibu & Anak';
  const pendingCount = visits.filter((v) => v.status === 'pending').length;
  const enteredCount = visits.filter((v) => v.status === 'entered').length;

  const handleAddVisit = () => {
    if (!dateValue) return;
    dispatch({ type: 'ADD_VISIT', payload: { patientId, column, date: dateValue } });
    setDateValue('');
    inputRef.current?.focus();
  };

  const handleRemoveVisit = (visitId: string) => {
    dispatch({ type: 'REMOVE_VISIT', payload: { patientId, column, visitId } });
  };

  const handleToggleStatus = (visitId: string) => {
    dispatch({ type: 'TOGGLE_VISIT_STATUS', payload: { patientId, column, visitId } });
  };

  // Sort visits by date descending (newest first)
  const sortedVisits = [...visits].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="flex flex-col rounded-xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}
      <div className="border-b border-slate-100 px-5 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-800">{title}</h3>
            <p className="text-[11px] text-slate-500">{subtitle}</p>
          </div>
          <div className="flex items-center gap-2">
            {pendingCount > 0 && (
              <span className="inline-flex items-center rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-700 ring-1 ring-amber-200">
                {pendingCount} pending
              </span>
            )}
            {enteredCount > 0 && (
              <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 ring-1 ring-emerald-200">
                {enteredCount} selesai
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Add Visit Input */}
      <div className="border-b border-slate-100 px-5 py-3">
        <label htmlFor={inputId} className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          Tambah Tanggal Kunjungan
        </label>
        <div className="flex gap-2">
          <input
            ref={inputRef}
            id={inputId}
            type="date"
            value={dateValue}
            onChange={(e) => setDateValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddVisit();
              }
            }}
            className="min-w-0 flex-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 transition-colors focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
          <button
            onClick={handleAddVisit}
            disabled={!dateValue}
            className="flex-shrink-0 rounded-lg bg-indigo-600 px-3.5 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Tambah
          </button>
        </div>
      </div>

      {/* Visit List */}
      <div className="flex-1 overflow-y-auto">
        {sortedVisits.length === 0 ? (
          <div className="px-5 py-8 text-center">
            <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-slate-100">
              <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-xs text-slate-400">Belum ada kunjungan</p>
          </div>
        ) : (
          <ul className="divide-y divide-slate-100">
            {sortedVisits.map((visit) => {
              const isPending = visit.status === 'pending';
              return (
                <li
                  key={visit.id}
                  className={`group flex items-center justify-between px-5 py-3 transition-colors ${
                    isPending ? 'bg-white' : 'bg-emerald-50/30'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`text-sm font-medium ${isPending ? 'text-slate-700' : 'text-slate-500'}`}>
                      {formatDate(visit.date)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleStatus(visit.id)}
                      onKeyDown={(e) => {
                        if (e.key === ' ') {
                          e.preventDefault();
                          handleToggleStatus(visit.id);
                        }
                      }}
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 ${
                        isPending
                          ? 'bg-amber-50 text-amber-700 ring-1 ring-amber-200 hover:bg-amber-100 focus:ring-amber-400'
                          : 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 hover:bg-emerald-100 focus:ring-emerald-400'
                      }`}
                      title={isPending ? 'Tandai sudah masuk database' : 'Tandai belum masuk database'}
                    >
                      {isPending ? (
                        <>
                          <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                          Belum Masuk DB
                        </>
                      ) : (
                        <>
                          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                          Sudah Masuk DB
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => handleRemoveVisit(visit.id)}
                      className="rounded p-1 text-slate-400 opacity-0 transition-opacity hover:text-rose-500 group-hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-1 focus:ring-rose-400"
                      title="Hapus kunjungan"
                    >
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
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
