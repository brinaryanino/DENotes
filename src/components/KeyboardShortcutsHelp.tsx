'use client';

import React, { useState, useEffect } from 'react';

const shortcuts = [
  { keys: ['Tab'], description: 'Navigasi antar field input' },
  { keys: ['Shift', 'Tab'], description: 'Navigasi mundur' },
  { keys: ['Enter'], description: 'Tambah item / konfirmasi' },
  { keys: ['Space'], description: 'Toggle status entry' },
  { keys: ['↑', '↓'], description: 'Navigasi daftar pasien' },
  { keys: ['Ctrl', '1'], description: 'Fokus input tanggal KI' },
  { keys: ['Ctrl', '2'], description: 'Fokus input tanggal KIA' },
  { keys: ['Ctrl', '3'], description: 'Fokus input tanggal Lab' },
  { keys: ['Ctrl', '4'], description: 'Fokus input tanggal USG' },
  { keys: ['?'], description: 'Buka/tutup bantuan ini' },
  { keys: ['Esc'], description: 'Tutup dialog' },
];

export default function KeyboardShortcutsHelp() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      const target = e.target as HTMLElement;
      const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;

      if (e.key === '?' && !isInput) {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }

      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }

      // Ctrl+1-4 shortcuts for focusing inputs
      if (e.ctrlKey && ['1', '2', '3', '4'].includes(e.key)) {
        e.preventDefault();
        const inputIds = ['ki-date-input', 'kia-date-input', 'lab-date-input', 'usg-date-input'];
        const idx = parseInt(e.key) - 1;
        const el = document.getElementById(inputIds[idx]);
        el?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setIsOpen(false)}>
      <div
        className="mx-4 w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-800">Pintasan Keyboard</h3>
          <button
            onClick={() => setIsOpen(false)}
            className="rounded-lg p-1 text-slate-400 hover:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-2">
          {shortcuts.map((shortcut, i) => (
            <div key={i} className="flex items-center justify-between rounded-lg px-2 py-1.5 hover:bg-slate-50">
              <span className="text-sm text-slate-600">{shortcut.description}</span>
              <div className="flex items-center gap-1">
                {shortcut.keys.map((key, j) => (
                  <React.Fragment key={j}>
                    {j > 0 && <span className="text-[10px] text-slate-400">+</span>}
                    <kbd className="rounded bg-slate-100 px-2 py-0.5 font-mono text-[11px] font-semibold text-slate-600 shadow-sm ring-1 ring-slate-200">
                      {key}
                    </kbd>
                  </React.Fragment>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 rounded-lg bg-slate-50 px-3 py-2 text-center text-[11px] text-slate-500">
          Tekan <kbd className="rounded bg-white px-1.5 py-0.5 font-mono text-[10px] shadow-sm ring-1 ring-slate-200">?</kbd> kapan saja untuk membuka bantuan ini
        </div>
      </div>
    </div>
  );
}
