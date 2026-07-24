import { GAS_WEB_APP_URL, gasClient, isGasConfigured } from './client';
import type { NewRequestInput, ParkingRequest, ParkingSettings, UpdateRequestInput } from '../types';

interface CloudDataResponse {
  requests?: ParkingRequest[];
  settings?: ParkingSettings;
}

interface ActionResponse {
  success: boolean;
}

async function sendAction(payload: Record<string, unknown>): Promise<ActionResponse | null> {
  if (!isGasConfigured()) {
    console.warn('구글 웹 앱 URL이 설정되지 않았습니다.');
    return null;
  }
  try {
    const { data } = await gasClient.post<ActionResponse>(GAS_WEB_APP_URL, JSON.stringify(payload));
    return data;
  } catch (error) {
    console.error('구글 시트 연동 중 에러 발생:', error);
    return null;
  }
}

export async function fetchCloudData(): Promise<CloudDataResponse> {
  if (!isGasConfigured()) return {};
  try {
    const { data } = await gasClient.get<CloudDataResponse>(GAS_WEB_APP_URL, { params: { action: 'getData' } });
    return data ?? {};
  } catch (error) {
    console.error('구글 시트 로딩 실패:', error);
    return {};
  }
}

export const addRequest = (input: NewRequestInput) => sendAction({ action: 'add', ...input });

export const updateRequest = (input: UpdateRequestInput) => sendAction({ action: 'update', ...input });

export const completeRequest = (id: string) => sendAction({ action: 'complete', id });

export const markUnrecognizedRequest = (id: string) => sendAction({ action: 'unrecognized', id });

export const deleteRequest = (id: string) => sendAction({ action: 'delete', id });

export const saveSettings = (courses: string[], tabletPassword: string, adminPassword: string) =>
  sendAction({ action: 'saveSettings', courses, tabletPassword, adminPassword });
