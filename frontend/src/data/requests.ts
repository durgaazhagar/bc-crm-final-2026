export type RequestStatus = 'Pending' | 'Fulfilled' | 'Emergency';

export interface RequestItem {
  id: number;
  requestId: string;
  hospitalName: string;
  bloodGroup: string;
  quantity: number;
  status: RequestStatus;
  requestedAt: string;
  notes: string;
}

const requests: RequestItem[] = [
  { id: 1, requestId: 'REQ-1001', hospitalName: 'Apollo Hospital', bloodGroup: 'A+', quantity: 2, status: 'Pending', requestedAt: '2026-06-10', notes: '' },
  { id: 2, requestId: 'REQ-1002', hospitalName: 'Government Medical College', bloodGroup: 'O-', quantity: 4, status: 'Emergency', requestedAt: '2026-06-12', notes: 'Trauma case' },
  { id: 3, requestId: 'REQ-1003', hospitalName: 'Sri Ram Hospital', bloodGroup: 'B+', quantity: 1, status: 'Fulfilled', requestedAt: '2026-06-08', notes: '' },
  { id: 4, requestId: 'REQ-1004', hospitalName: 'City Care Clinic', bloodGroup: 'O+', quantity: 3, status: 'Pending', requestedAt: '2026-06-11', notes: '' },
  { id: 5, requestId: 'REQ-1005', hospitalName: 'Mercy General', bloodGroup: 'A-', quantity: 2, status: 'Pending', requestedAt: '2026-06-09', notes: '' },
  { id: 6, requestId: 'REQ-1006', hospitalName: 'St. Marys Hospital', bloodGroup: 'B-', quantity: 2, status: 'Emergency', requestedAt: '2026-06-13', notes: 'Multiple casualties' }
];

export default requests;
