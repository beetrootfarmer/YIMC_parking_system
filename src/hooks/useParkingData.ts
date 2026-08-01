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
  const saveSettingsMutation = useMutation({
    mutationFn: (input: { courses: string[]; tabletPassword: string; adminPassword: string }) =>
      api.saveSettings(input.courses, input.tabletPassword, input.adminPassword),
  });

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

  return {
    requests: query.data?.requests ?? [],
    settings: query.data?.settings ?? DEFAULT_SETTINGS,
    isSyncing: query.isFetching,
    isSubmitting: addMutation.isPending,
    submitRequest: (input: NewRequestInput) => runAction(addMutation.mutateAsync, input),
    updateRequestById: (input: UpdateRequestInput) => runAction(updateMutation.mutateAsync, input),
    completeRequestById: (id: string) => runAction(completeMutation.mutateAsync, id),
    markUnrecognized: (id: string) => runAction(unrecognizedMutation.mutateAsync, id),
    deleteRequestById: (ids: string[] | 'all') => runAction(deleteMutation.mutateAsync, ids),
    saveSettings: (courses: string[], tabletPassword: string, adminPassword: string) =>
      runAction(saveSettingsMutation.mutateAsync, { courses, tabletPassword, adminPassword }),
  };
};
