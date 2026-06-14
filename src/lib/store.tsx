'use client';

import React, { createContext, useContext, useReducer, useEffect, useCallback, ReactNode } from 'react';
import { AppState, AppAction, Patient, generateId } from './types';
import { mockPatients } from './mockData';

const STORAGE_KEY = 'denotes-app-state';

const initialState: AppState = {
  patients: [],
  selectedPatientId: null,
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'LOAD_STATE':
      return action.payload;

    case 'ADD_PATIENT': {
      const newPatient: Patient = {
        id: generateId(),
        name: action.payload.name.trim(),
        kiVisits: [],
        kiaVisits: [],
        labTests: [],
        usgTests: [],
      };
      return {
        ...state,
        patients: [...state.patients, newPatient],
      };
    }

    case 'ADD_PATIENTS_BATCH': {
      const newPatients: Patient[] = action.payload.names
        .map((n) => n.trim())
        .filter((n) => n.length > 0)
        .map((name) => ({
          id: generateId(),
          name,
          kiVisits: [],
          kiaVisits: [],
          labTests: [],
          usgTests: [],
        }));
      return {
        ...state,
        patients: [...state.patients, ...newPatients],
      };
    }

    case 'REMOVE_PATIENT': {
      const filtered = state.patients.filter((p) => p.id !== action.payload.patientId);
      return {
        ...state,
        patients: filtered,
        selectedPatientId:
          state.selectedPatientId === action.payload.patientId ? null : state.selectedPatientId,
      };
    }

    case 'SELECT_PATIENT':
      return { ...state, selectedPatientId: action.payload.patientId };

    case 'ADD_VISIT': {
      const { patientId, column, date } = action.payload;
      return {
        ...state,
        patients: state.patients.map((p) => {
          if (p.id !== patientId) return p;
          const newVisit = { id: generateId(), date, status: 'pending' as const };
          if (column === 'ki') {
            return { ...p, kiVisits: [...p.kiVisits, newVisit] };
          }
          return { ...p, kiaVisits: [...p.kiaVisits, newVisit] };
        }),
      };
    }

    case 'REMOVE_VISIT': {
      const { patientId, column, visitId } = action.payload;
      return {
        ...state,
        patients: state.patients.map((p) => {
          if (p.id !== patientId) return p;
          if (column === 'ki') {
            return { ...p, kiVisits: p.kiVisits.filter((v) => v.id !== visitId) };
          }
          return { ...p, kiaVisits: p.kiaVisits.filter((v) => v.id !== visitId) };
        }),
      };
    }

    case 'TOGGLE_VISIT_STATUS': {
      const { patientId, column, visitId } = action.payload;
      return {
        ...state,
        patients: state.patients.map((p) => {
          if (p.id !== patientId) return p;
          const toggleVisit = (visits: Patient['kiVisits']) =>
            visits.map((v) =>
              v.id === visitId
                ? { ...v, status: v.status === 'pending' ? ('entered' as const) : ('pending' as const) }
                : v
            );
          if (column === 'ki') {
            return { ...p, kiVisits: toggleVisit(p.kiVisits) };
          }
          return { ...p, kiaVisits: toggleVisit(p.kiaVisits) };
        }),
      };
    }

    case 'ADD_TEST': {
      const { patientId, testType, date } = action.payload;
      return {
        ...state,
        patients: state.patients.map((p) => {
          if (p.id !== patientId) return p;
          const newTest = { id: generateId(), date, status: 'pending' as const };
          if (testType === 'lab') {
            return { ...p, labTests: [...p.labTests, newTest] };
          }
          return { ...p, usgTests: [...p.usgTests, newTest] };
        }),
      };
    }

    case 'REMOVE_TEST': {
      const { patientId, testType, testId } = action.payload;
      return {
        ...state,
        patients: state.patients.map((p) => {
          if (p.id !== patientId) return p;
          if (testType === 'lab') {
            return { ...p, labTests: p.labTests.filter((t) => t.id !== testId) };
          }
          return { ...p, usgTests: p.usgTests.filter((t) => t.id !== testId) };
        }),
      };
    }

    case 'TOGGLE_TEST_STATUS': {
      const { patientId, testType, testId } = action.payload;
      return {
        ...state,
        patients: state.patients.map((p) => {
          if (p.id !== patientId) return p;
          const toggleTest = (tests: Patient['labTests']) =>
            tests.map((t) =>
              t.id === testId
                ? { ...t, status: t.status === 'pending' ? ('entered' as const) : ('pending' as const) }
                : t
            );
          if (testType === 'lab') {
            return { ...p, labTests: toggleTest(p.labTests) };
          }
          return { ...p, usgTests: toggleTest(p.usgTests) };
        }),
      };
    }

    case 'CLEAR_ALL':
      return { patients: [], selectedPatientId: null };

    default:
      return state;
  }
}

interface StoreContextValue {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  selectedPatient: Patient | null;
}

const StoreContext = createContext<StoreContextValue | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const [hydrated, setHydrated] = React.useState(false);

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as AppState;
        if (parsed.patients && Array.isArray(parsed.patients)) {
          dispatch({ type: 'LOAD_STATE', payload: parsed });
          setHydrated(true);
          return;
        }
      }
    } catch {
      // localStorage unavailable or corrupted, fall through to mock data
    }
    // Load mock data if no stored state
    dispatch({
      type: 'LOAD_STATE',
      payload: { patients: mockPatients, selectedPatientId: null },
    });
    setHydrated(true);
  }, []);

  // Persist to localStorage on every state change (after hydration)
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // localStorage full or unavailable — silently ignore
    }
  }, [state, hydrated]);

  const selectedPatient = React.useMemo(
    () => state.patients.find((p) => p.id === state.selectedPatientId) ?? null,
    [state.patients, state.selectedPatientId]
  );

  const value = React.useMemo(
    () => ({ state, dispatch, selectedPatient }),
    [state, dispatch, selectedPatient]
  );

  // Prevent hydration mismatch — render nothing until localStorage is read
  if (!hydrated) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-3 border-slate-300 border-t-indigo-600" />
          <span className="text-sm text-slate-500">Memuat data...</span>
        </div>
      </div>
    );
  }

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreContextValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within a StoreProvider');
  return ctx;
}

// Convenience hook to get the dispatch function
export function useAppDispatch(): React.Dispatch<AppAction> {
  return useStore().dispatch;
}

// Hook to reset to mock data
export function useResetToMock() {
  const { dispatch } = useStore();
  return useCallback(() => {
    dispatch({
      type: 'LOAD_STATE',
      payload: { patients: mockPatients, selectedPatientId: null },
    });
  }, [dispatch]);
}
