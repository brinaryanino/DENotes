'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';

interface DateInputProps {
  id?: string;
  onSubmit: (date: string) => void;
  placeholder?: string;
  className?: string;
}

// Validates YYYY-MM-DD format and checks if the date is real
function isValidDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [y, m, d] = value.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  return date.getFullYear() === y && date.getMonth() === m - 1 && date.getDate() === d;
}

export default function DateInput({ id, onSubmit, placeholder = 'YYYY-MM-DD', className = '' }: DateInputProps) {
  const [value, setValue] = useState('');
  const [error, setError] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Clear error after a short delay
  useEffect(() => {
    if (!error) return;
    const t = setTimeout(() => setError(false), 1500);
    return () => clearTimeout(t);
  }, [error]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value;

    // Only allow digits and dashes
    raw = raw.replace(/[^\d-]/g, '');

    // Auto-insert dashes as user types digits
    // Strip all dashes first, then re-insert at correct positions
    const digits = raw.replace(/-/g, '');

    let formatted = '';
    for (let i = 0; i < digits.length && i < 8; i++) {
      if (i === 4 || i === 6) formatted += '-';
      formatted += digits[i];
    }

    setValue(formatted);
    setError(false);
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        const trimmed = value.trim();
        if (!trimmed) return;

        if (!isValidDate(trimmed)) {
          setError(true);
          return;
        }

        onSubmit(trimmed);
        setValue('');
        setError(false);
        // Keep focus on the input for rapid entry
        inputRef.current?.focus();
      }
    },
    [value, onSubmit]
  );

  // Handle paste — try to extract a valid date
  const handlePaste = useCallback((e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    let pasted = e.clipboardData.getData('text').trim();

    // Try to normalize common formats: DD/MM/YYYY, DD-MM-YYYY, YYYY/MM/DD
    pasted = pasted.replace(/\//g, '-');

    // If it looks like DD-MM-YYYY, flip it
    if (/^\d{2}-\d{2}-\d{4}$/.test(pasted)) {
      const [d, m, y] = pasted.split('-');
      pasted = `${y}-${m}-${d}`;
    }

    // Extract digits and reformat
    const digits = pasted.replace(/[^\d]/g, '');
    let formatted = '';
    for (let i = 0; i < digits.length && i < 8; i++) {
      if (i === 4 || i === 6) formatted += '-';
      formatted += digits[i];
    }

    setValue(formatted);
    setError(false);
  }, []);

  return (
    <div className="relative flex-1 min-w-0">
      <input
        ref={inputRef}
        id={id}
        type="text"
        inputMode="numeric"
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        placeholder={placeholder}
        maxLength={10}
        autoComplete="off"
        className={`w-full rounded-lg border bg-slate-50 px-3 py-2 text-sm tabular-nums tracking-wide text-slate-700 transition-colors placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-1 ${
          error
            ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-400'
            : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-500'
        } ${className}`}
      />
      {error && (
        <span className="absolute -bottom-5 left-0 text-[10px] font-medium text-rose-500 animate-in fade-in">
          Format tidak valid — gunakan YYYY-MM-DD
        </span>
      )}
    </div>
  );
}
