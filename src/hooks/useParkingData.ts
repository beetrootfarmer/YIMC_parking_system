import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as api from '../api/parkingApi';
import type { NewRequestInput, ParkingSettings, UpdateRequestInput } from '../types';

const CLOUD_DATA_KEY = ['parking', 'cloudData'] as const;

const DEFAULT_SETTINGS: ParkingSettings = {
  courses: ['오디오 스튜디오', '스튜디오 대', '스튜디오 소', '1인 미디어실'],
  tabletPassword: '0000',
  adminPassword: '1234',
};

interface UseParkingDataOptions {
  polling?: boolean;
}

export const useParkingData = ({ polling = true }: UseParkingDataOptions = {}) => {
  const queryClient = useQueryClient();
  const [isRegistering, setIsRegistering] = useState(false);
  const [pendingActionIds, setPendingActionIds] = useState<Set<string>>(new Set());

  const query = useQuery({
    queryKey: CLOUD_DATA_KEY,
    queryFn: api.fetchCloudData,
    refetchInterval: polling ? 5000 : false,
    refetchIntervalInBackground: false,
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: CLOUD_DATA_KEY });

  const addMutation = useMutation({ mutationFn: (input: NewRequestInput) => api.addRequest(input) });
  const updateMutation = useMutation({ mutationFn: (input: UpdateRequestInput) => api.updateRequest(input) });
  const completeMutation = useMutation({ mutationFn: (id: string) => api.completeRequest(id) });
  const unrecognizedMutation = useMutation({ mutationFn: (id: string) => api.markUnrecognizedRequest(id) });
  const deleteMutation = useMutation({ mutationFn: (ids: string[] | 'all') => api.deleteRequest(ids) });
  const cancelMutation = useMutation({ mutationFn: (ids: string[] | 'all') => api.cancelRequest(ids) });
  const saveSettingsMutation = useMutation({
    mutationFn: (input: { courses: string[]; tabletPassword: string; adminPassword: string }) =>
      api.saveSettings(input.courses, input.tabletPassword, input.adminPassword),
  });

  // 서버 응답뿐 아니라 뒤이은 목록 재조회(invalidate)가 끝날 때까지 true를 유지해,
  // 화면에 최신 상태가 반영되기 전에 버튼이 다시 활성화되어 중복 클릭/중복 등록으로
  // 이어지는 것을 막는다.
  const runAction = async <T>(
    mutateAsync: (input: T) => Promise<{ success: boolean } | null>,
    input: T,
  ): Promise<boolean> => {
    const res = await mutateAsync(input);
    if (res?.success) {
      await invalidate();
      return true;
    }
    return false;
  };

  const runIdAction = async (id: string, mutateAsync: (id: string) => Promise<{ success: boolean } | null>) => {
    setPendingActionIds((prev) => new Set(prev).add(id));
    try {
      return await runAction(mutateAsync, id);
    } finally {
      setPendingActionIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  const submitRequest = async (input: NewRequestInput) => {
    setIsRegistering(true);
    try {
      return await runAction(addMutation.mutateAsync, input);
    } finally {
      setIsRegistering(false);
    }
  };

  return {
    requests: query.data?.requests ?? [],
    settings: query.data?.settings ?? DEFAULT_SETTINGS,
    isSyncing: query.isFetching,
    isSubmitting: isRegistering,
    pendingActionIds,
    submitRequest,
    updateRequestById: (input: UpdateRequestInput) => runAction(updateMutation.mutateAsync, input),
    completeRequestById: (id: string) => runIdAction(id, completeMutation.mutateAsync),
    markUnrecognized: (id: string) => runIdAction(id, unrecognizedMutation.mutateAsync),
    deleteRequestById: (ids: string[] | 'all') => runAction(deleteMutation.mutateAsync, ids),
    cancelRequestById: (ids: string[] | 'all') => runAction(cancelMutation.mutateAsync, ids),
    saveSettings: (courses: string[], tabletPassword: string, adminPassword: string) =>
      runAction(saveSettingsMutation.mutateAsync, { courses, tabletPassword, adminPassword }),
  };
};
