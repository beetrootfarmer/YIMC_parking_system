import { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { FaHome } from 'react-icons/fa';
import { useParkingData } from '../hooks/useParkingData';
import { Toast } from '../components/Toast';
import { ConfirmModal } from '../components/ConfirmModal';
import { RegistrationPanel } from './tablet/RegistrationPanel';
import { LiveRequestPanel } from './tablet/LiveRequestPanel';
import { EditRequestModal } from './tablet/EditRequestModal';
import { maskCarNumber } from '../utils/mask';
import type { ParkingRequest, ToastState } from '../types';

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 1rem;
  background: ${({ theme }) => theme.colors.gray100};
  min-height: 100vh;
  width: 100%;
  box-sizing: border-box;
  position: relative;

  @media (min-width: 768px) {
    flex-direction: row;
    padding: 2rem;
  }
`;

const HomeButton = styled.button`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  width: 2rem;
  height: 2rem;
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.slate400};
  opacity: 0.1;
  cursor: pointer;
  transition: opacity 0.15s;

  &:hover {
    opacity: 1;
  }
`;

export const TabletPage = () => {
  const navigate = useNavigate();
  const { requests, settings, isSubmitting, submitRequest, updateRequestById, deleteRequestById } = useParkingData();
  const [toast, setToast] = useState<ToastState | null>(null);
  const [editingReq, setEditingReq] = useState<ParkingRequest | null>(null);
  const [cancelingReq, setCancelingReq] = useState<ParkingRequest | null>(null);

  return (
    <PageWrapper>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <RegistrationPanel
        coursesList={settings.courses}
        isSubmitting={isSubmitting}
        onSubmit={submitRequest}
        onToast={setToast}
      />

      <LiveRequestPanel requests={requests} onEdit={setEditingReq} onRequestCancel={setCancelingReq} />

      {editingReq && (
        <EditRequestModal
          request={editingReq}
          onSave={async (input) => {
            const success = await updateRequestById(input);
            if (success) {
              setEditingReq(null);
              setToast({ message: '접수 내역이 수정되었습니다.', type: 'success' });
            }
            return success;
          }}
          onClose={() => setEditingReq(null)}
        />
      )}

      {cancelingReq && (
        <ConfirmModal
          title="접수 취소 확인"
          message={
            <>
              <strong style={{ color: '#1f2937', fontWeight: 700 }}>{maskCarNumber(cancelingReq.carNumber)}</strong> 차량의
              <br />
              주차 등록 신청을 취소하시겠습니까?
            </>
          }
          confirmLabel="취소 확정"
          cancelLabel="닫기"
          variant="danger"
          onConfirm={async () => {
            await deleteRequestById(cancelingReq.id);
            setCancelingReq(null);
            setToast({ message: '접수가 취소되었습니다.', type: 'error' });
          }}
          onCancel={() => setCancelingReq(null)}
        />
      )}

      <HomeButton type="button" onClick={() => navigate('/')} title="처음으로">
        <FaHome />
      </HomeButton>
    </PageWrapper>
  );
};
