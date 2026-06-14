// Core data types for DENotes medical data entry application

export type EntryStatus = 'pending' | 'entered';

export interface Visit {
  id: string;
  date: string; // ISO date string YYYY-MM-DD
  status: EntryStatus;
}

export interface TestLog {
  id: string;
  date: string; // ISO date string YYYY-MM-DD
  status: EntryStatus;
}

export interface Patient {
  id: string;
  name: string;
  kiVisits: Visit[];
  kiaVisits: Visit[];
  labTests: TestLog[];
  usgTests: TestLog[];
}

export interface AppState {
  patients: Patient[];
  selectedPatientId: string | null;
}

// Action types for the reducer
export type AppAction =
  | { type: 'LOAD_STATE'; payload: AppState }
  | { type: 'ADD_PATIENT'; payload: { name: string } }
  | { type: 'ADD_PATIENTS_BATCH'; payload: { names: string[] } }
  | { type: 'REMOVE_PATIENT'; payload: { patientId: string } }
  | { type: 'SELECT_PATIENT'; payload: { patientId: string | null } }
  | { type: 'ADD_VISIT'; payload: { patientId: string; column: 'ki' | 'kia'; date: string } }
  | { type: 'REMOVE_VISIT'; payload: { patientId: string; column: 'ki' | 'kia'; visitId: string } }
  | { type: 'TOGGLE_VISIT_STATUS'; payload: { patientId: string; column: 'ki' | 'kia'; visitId: string } }
  | { type: 'ADD_TEST'; payload: { patientId: string; testType: 'lab' | 'usg'; date: string } }
  | { type: 'REMOVE_TEST'; payload: { patientId: string; testType: 'lab' | 'usg'; testId: string } }
  | { type: 'TOGGLE_TEST_STATUS'; payload: { patientId: string; testType: 'lab' | 'usg'; testId: string } }
  | { type: 'CLEAR_ALL' };

// Helper to generate unique IDs
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

// Helper to count pending items for a patient
export function countPending(patient: Patient): {
  ki: number;
  kia: number;
  lab: number;
  usg: number;
  total: number;
} {
  const ki = patient.kiVisits.filter((v) => v.status === 'pending').length;
  const kia = patient.kiaVisits.filter((v) => v.status === 'pending').length;
  const lab = patient.labTests.filter((t) => t.status === 'pending').length;
  const usg = patient.usgTests.filter((t) => t.status === 'pending').length;
  return { ki, kia, lab, usg, total: ki + kia + lab + usg };
}

// Helper to format date for display
export function formatDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}
