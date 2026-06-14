'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useStore, useAppDispatch, useResetToMock } from '@/lib/store';
import { countPending } from '@/lib/types';

export default function Sidebar() {
  const { state, selectedPatient } = useStore();
  const dispatch = useAppDispatch();
  const resetToMock = useResetToMock();

  const [newName, setNewName] = useState('');
  const [showBatchModal, setShowBatchModal] = useState(false);
  const [batchText, setBatchText] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const handleAddPatient = useCallback(() => {
    const name = newName.trim();
    if (!name) return;
    dispatch({ type: 'ADD_PATIENT', payload: { name } });
    setNewName('');
    inputRef.current?.focus();
  }, [newName, dispatch]);

  const handleBatchAdd = useCallback(() => {
    const names = batchText
      .split('\n')
      .map((n) => n.trim())
      .filter((n) => n.length > 0);
    if (names.length === 0) return;
    dispatch({ type: 'ADD_PATIENTS_BATCH', payload: { names } });
    setBatchText('');
    setShowBatchModal(false);
  }, [batchText, dispatch]);

  const handleDeletePatient = useCallback(
    (patientId: string) => {
      dispatch({ type: 'REMOVE_PATIENT', payload: { patientId } });
      setConfirmDeleteId(null);
    },
    [dispatch]
  );

  // Keyboard navigation for patient list
  const handleListKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const patients = state.patients;
      if (patients.length === 0) return;

      const currentIdx = patients.findIndex((p) => p.id === state.selectedPatientId);

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        const nextIdx = currentIdx < patients.length - 1 ? currentIdx + 1 : 0;
        dispatch({ type: 'SELECT_PATIENT', payload: { patientId: patients[nextIdx].id } });
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        const prevIdx = currentIdx > 0 ? currentIdx - 1 : patients.length - 1;
        dispatch({ type: 'SELECT_PATIENT', payload: { patientId: patients[prevIdx].id } });
      }
    },
    [state.patients, state.selectedPatientId, dispatch]
  );

  // Auto-scroll to selected patient
  useEffect(() => {
    if (state.selectedPatientId && listRef.current) {
      const el = listRef.current.querySelector(`[data-patient-id="${state.selectedPatientId}"]`);
      el?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }, [state.selectedPatientId]);

  return (
    <aside className="flex h-full w-72 flex-shrink-0 flex-col bg-slate-900 text-white">
      {/* Header */}
      <div className="border-b border-slate-700/50 px-4 py-5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight">DENotes</h1>
            <p className="text-[11px] text-slate-400">Data Entry Tracker</p>
          </div>
        </div>
      </div>

      {/* Add Patient */}
      <div className="border-b border-slate-700/50 px-4 py-3">
        <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          Tambah Pasien
        </label>
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddPatient();
              }
            }}
            placeholder="Nama Ibu Hamil..."
            className="min-w-0 flex-1 rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-white placeholder-slate-500 transition-colors focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
          <button
            onClick={handleAddPatient}
            title="Tambah pasien"
            className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-indigo-600 text-white transition-colors hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
        <button
          onClick={() => setShowBatchModal(true)}
          className="mt-2 w-full rounded-lg border border-dashed border-slate-600 px-3 py-1.5 text-xs text-slate-400 transition-colors hover:border-slate-500 hover:text-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        >
          + Tambah Batch (Banyak Nama)
        </button>
      </div>

      {/* Patient List */}
      <div className="flex items-center justify-between border-b border-slate-700/50 px-4 py-2">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          Daftar Pasien ({state.patients.length})
        </span>
        <div className="flex gap-1">
          <button
            onClick={resetToMock}
            title="Reset ke data contoh"
            className="rounded p-1 text-slate-500 transition-colors hover:text-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
          <button
            onClick={() => {
              if (window.confirm('Hapus semua data pasien?')) {
                dispatch({ type: 'CLEAR_ALL' });
              }
            }}
            title="Hapus semua"
            className="rounded p-1 text-slate-500 transition-colors hover:text-rose-400 focus:outline-none focus:ring-1 focus:ring-rose-400"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      <div
        ref={listRef}
        className="flex-1 overflow-y-auto"
        onKeyDown={handleListKeyDown}
        tabIndex={0}
        role="listbox"
        aria-label="Daftar pasien"
      >
        {state.patients.length === 0 ? (
          <div className="px-4 py-8 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-800">
              <svg className="h-6 w-6 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <p className="text-xs text-slate-500">Belum ada pasien</p>
            <p className="mt-1 text-[11px] text-slate-600">Tambah nama di atas untuk memulai</p>
          </div>
        ) : (
          state.patients.map((patient) => {
            const pending = countPending(patient);
            const isSelected = patient.id === state.selectedPatientId;

            return (
              <div
                key={patient.id}
                data-patient-id={patient.id}
                role="option"
                aria-selected={isSelected}
                onClick={() => dispatch({ type: 'SELECT_PATIENT', payload: { patientId: patient.id } })}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    dispatch({ type: 'SELECT_PATIENT', payload: { patientId: patient.id } });
                  }
                }}
                className={`group relative cursor-pointer border-b border-slate-800 px-4 py-3 transition-colors ${
                  isSelected
                    ? 'border-l-2 border-l-indigo-500 bg-slate-800/80'
                    : 'border-l-2 border-l-transparent hover:bg-slate-800/40'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className={`truncate text-sm font-medium ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                      {patient.name}
                    </p>
                    <div className="mt-1 flex items-center gap-2">
                      {pending.total > 0 ? (
                        <span className="inline-flex items-center rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-semibold text-amber-400">
                          {pending.total} pending
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">
                          ✓ Lengkap
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Delete button */}
                  {confirmDeleteId === patient.id ? (
                    <div className="flex gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeletePatient(patient.id);
                        }}
                        className="rounded bg-rose-600 px-2 py-1 text-[10px] font-semibold text-white hover:bg-rose-500"
                      >
                        Hapus
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setConfirmDeleteId(null);
                        }}
                        className="rounded bg-slate-700 px-2 py-1 text-[10px] text-slate-300 hover:bg-slate-600"
                      >
                        Batal
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setConfirmDeleteId(patient.id);
                      }}
                      className="rounded p-1 text-slate-600 opacity-0 transition-opacity hover:text-rose-400 group-hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-1 focus:ring-rose-400"
                      title="Hapus pasien"
                    >
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-slate-700/50 px-4 py-3">
        <div className="flex items-center justify-between text-[11px] text-slate-500">
          <span>Tekan <kbd className="rounded bg-slate-700 px-1.5 py-0.5 text-[10px] font-mono">?</kbd> untuk bantuan</span>
          <span>↑↓ navigasi</span>
        </div>
      </div>

      {/* Batch Modal */}
      {showBatchModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div
            className="mx-4 w-full max-w-md rounded-2xl bg-slate-800 p-6 shadow-2xl"
            onKeyDown={(e) => {
              if (e.key === 'Escape') setShowBatchModal(false);
            }}
          >
            <h3 className="mb-1 text-base font-semibold text-white">Tambah Batch Pasien</h3>
            <p className="mb-4 text-xs text-slate-400">Masukkan satu nama per baris</p>
            <textarea
              autoFocus
              value={batchText}
              onChange={(e) => setBatchText(e.target.value)}
              placeholder={"Siti Aminah\nDewi Lestari\nRina Handayani"}
              rows={6}
              className="w-full rounded-lg border border-slate-600 bg-slate-900 px-4 py-3 text-sm text-white placeholder-slate-600 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setShowBatchModal(false)}
                className="rounded-lg px-4 py-2 text-sm text-slate-400 hover:text-white focus:outline-none focus:ring-1 focus:ring-slate-500"
              >
                Batal
              </button>
              <button
                onClick={handleBatchAdd}
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              >
                Tambah Semua
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
