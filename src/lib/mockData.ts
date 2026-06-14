import { Patient } from './types';

export const mockPatients: Patient[] = [
  {
    id: 'patient-001',
    name: 'Siti Nurhaliza',
    kiVisits: [
      { id: 'ki-001', date: '2026-03-15', status: 'entered' },
      { id: 'ki-002', date: '2026-04-12', status: 'entered' },
      { id: 'ki-003', date: '2026-05-10', status: 'pending' },
      { id: 'ki-004', date: '2026-06-07', status: 'pending' },
    ],
    kiaVisits: [
      { id: 'kia-001', date: '2026-03-20', status: 'entered' },
      { id: 'kia-002', date: '2026-05-15', status: 'pending' },
      { id: 'kia-003', date: '2026-06-10', status: 'pending' },
    ],
    labTests: [
      { id: 'lab-001', date: '2026-03-16', status: 'entered' },
      { id: 'lab-002', date: '2026-05-11', status: 'pending' },
    ],
    usgTests: [
      { id: 'usg-001', date: '2026-03-18', status: 'entered' },
      { id: 'usg-002', date: '2026-06-08', status: 'pending' },
    ],
  },
  {
    id: 'patient-002',
    name: 'Dewi Ratnasari',
    kiVisits: [
      { id: 'ki-005', date: '2026-04-01', status: 'entered' },
      { id: 'ki-006', date: '2026-05-02', status: 'pending' },
    ],
    kiaVisits: [
      { id: 'kia-004', date: '2026-04-05', status: 'pending' },
      { id: 'kia-005', date: '2026-05-08', status: 'pending' },
    ],
    labTests: [
      { id: 'lab-003', date: '2026-04-02', status: 'pending' },
    ],
    usgTests: [
      { id: 'usg-003', date: '2026-04-03', status: 'pending' },
      { id: 'usg-004', date: '2026-05-05', status: 'pending' },
    ],
  },
  {
    id: 'patient-003',
    name: 'Rina Wijayanti',
    kiVisits: [
      { id: 'ki-007', date: '2026-02-20', status: 'entered' },
      { id: 'ki-008', date: '2026-03-25', status: 'entered' },
      { id: 'ki-009', date: '2026-04-28', status: 'entered' },
    ],
    kiaVisits: [
      { id: 'kia-006', date: '2026-02-25', status: 'entered' },
      { id: 'kia-007', date: '2026-04-30', status: 'entered' },
    ],
    labTests: [
      { id: 'lab-004', date: '2026-02-21', status: 'entered' },
      { id: 'lab-005', date: '2026-04-29', status: 'entered' },
    ],
    usgTests: [
      { id: 'usg-005', date: '2026-03-01', status: 'entered' },
    ],
  },
];
