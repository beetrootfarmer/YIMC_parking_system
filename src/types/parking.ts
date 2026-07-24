export type RequestStatus = '대기중' | '인식안됨' | '완료';

export interface ParkingRequest {
  id: string;
  course: string;
  usageTime: string;
  name: string;
  carNumber: string;
  status: RequestStatus;
  timestamp: number;
}

export interface ParkingSettings {
  courses: string[];
  tabletPassword: string;
  adminPassword: string;
}

export interface NewRequestInput {
  course: string;
  usageTime: string;
  name: string;
  carNumber: string;
}

export interface UpdateRequestInput extends NewRequestInput {
  id: string;
}

export type UserRole = 'tablet' | 'admin';

export interface ToastState {
  message: string;
  type: 'success' | 'error';
}
