import { useState } from 'react';
import styled from 'styled-components';
import { FaTrashAlt, FaVolumeUp } from 'react-icons/fa';
import { useParkingData } from '../../hooks/useParkingData';
import { playNotificationSound } from '../../lib/audio';
import { Button } from '../../styles/shared';
import { StatusBadge } from '../../components/StatusBadge';
import { ConfirmModal } from '../../components/ConfirmModal';
import { formatDate, formatTime } from '../../utils/format';
import type { ParkingRequest } from '../../types';

const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 1.5rem;
`;

const HeaderTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.slate800};
  margin: 0 0 0.25rem;
`;

const HeaderSubtitle = styled.p`
  color: ${({ theme }) => theme.colors.slate500};
  margin: 0;
`;

const TestSoundButton = styled.button`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.blue600};
  background: ${({ theme }) => theme.colors.blue50};
  border: 1px solid ${({ theme }) => theme.colors.blue200};
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  transition: background-color 0.15s;

  &:hover {
    background: ${({ theme }) => theme.colors.blue100};
  }
`;

const TableCard = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border-radius: 1rem;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.colors.slate200};
`;

const TableScroll = styled.div`
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  text-align: left;
  border-collapse: collapse;
`;

const Thead = styled.thead`
  background: ${({ theme }) => theme.colors.slate50};
  border-bottom: 1px solid ${({ theme }) => theme.colors.slate200};
  color: ${({ theme }) => theme.colors.slate600};
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const Th = styled.th`
  padding: 1rem;
  font-weight: 600;
`;

const Tbody = styled.tbody`
  tr {
    border-top: 1px solid ${({ theme }) => theme.colors.slate100};
  }
  tr:hover {
    background: ${({ theme }) => theme.colors.slate50};
  }
`;

const Td = styled.td`
  padding: 1rem;
  color: ${({ theme }) => theme.colors.slate600};
`;

const EmptyRow = styled.td`
  padding: 2rem;
  text-align: center;
  color: ${({ theme }) => theme.colors.slate400};
`;

const DateText = styled.div`
  font-size: 0.875rem;
`;

const TimeText = styled.div`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.slate800};
`;

const CourseTag = styled.span`
  background: ${({ theme }) => theme.colors.gray100};
  color: ${({ theme }) => theme.colors.gray700};
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.875rem;
`;

const NameText = styled.span`
  font-weight: 500;
  color: ${({ theme }) => theme.colors.slate800};
`;

const CarNumberText = styled.span`
  font-weight: 700;
  color: ${({ theme }) => theme.colors.blue900};
  letter-spacing: 0.025em;
  font-size: 1.125rem;
`;

const ActionsCell = styled(Td)`
  text-align: center;
  white-space: nowrap;

  ${Button} {
    margin-left: 0.5rem;
    font-size: 0.875rem;

    &:first-child {
      margin-left: 0;
    }
  }
`;

const DeleteIconButton = styled(Button)`
  background: ${({ theme }) => theme.colors.slate100};
  color: ${({ theme }) => theme.colors.slate600};

  &:hover {
    background: ${({ theme }) => theme.colors.red50};
    color: ${({ theme }) => theme.colors.red600};
  }
`;

type PendingAction = { type: 'unrecognized' | 'delete'; request: ParkingRequest };

export const DashboardPage = () => {
  const { requests, completeRequestById, markUnrecognized, deleteRequestById } = useParkingData();
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(null);

  const runPendingAction = async () => {
    if (!pendingAction) return;
    if (pendingAction.type === 'unrecognized') await markUnrecognized(pendingAction.request.id);
    else await deleteRequestById(pendingAction.request.id);
    setPendingAction(null);
  };

  return (
    <div>
      <HeaderRow>
        <div>
          <HeaderTitle>오늘의 접수 현황</HeaderTitle>
          <HeaderSubtitle>구글 클라우드 시트와 실시간 연동 중입니다.</HeaderSubtitle>
        </div>
        <TestSoundButton type="button" onClick={playNotificationSound}>
          <FaVolumeUp /> 소리 테스트
        </TestSoundButton>
      </HeaderRow>

      <TableCard>
        <TableScroll>
          <Table>
            <Thead>
              <tr>
                <Th>요청 시간</Th>
                <Th>대관 시설/강좌</Th>
                <Th>이용 시간</Th>
                <Th>이름</Th>
                <Th>차량 번호</Th>
                <Th>상태</Th>
                <Th style={{ textAlign: 'center' }}>관리</Th>
              </tr>
            </Thead>
            <Tbody>
              {requests.length === 0 ? (
                <tr>
                  <EmptyRow colSpan={7}>접수된 주차 요청이 없습니다.</EmptyRow>
                </tr>
              ) : (
                [...requests].reverse().map((req) => (
                  <tr key={req.id}>
                    <Td>
                      <DateText>{formatDate(req.timestamp)}</DateText>
                      <TimeText>{formatTime(req.timestamp)}</TimeText>
                    </Td>
                    <Td>
                      <CourseTag>{req.course}</CourseTag>
                    </Td>
                    <Td>{req.usageTime}</Td>
                    <Td>
                      <NameText>{req.name}</NameText>
                    </Td>
                    <Td>
                      <CarNumberText>{req.carNumber}</CarNumberText>
                    </Td>
                    <Td>
                      <StatusBadge status={req.status} variant="admin" />
                    </Td>
                    <ActionsCell>
                      {req.status === '대기중' && (
                        <>
                          <Button type="button" $variant="primary" onClick={() => completeRequestById(req.id)}>
                            등록완료
                          </Button>
                          <Button
                            type="button"
                            $variant="warning"
                            onClick={() => setPendingAction({ type: 'unrecognized', request: req })}
                          >
                            인식불가
                          </Button>
                        </>
                      )}
                      <DeleteIconButton
                        type="button"
                        $variant="neutral"
                        title="기록 삭제"
                        onClick={() => setPendingAction({ type: 'delete', request: req })}
                      >
                        <FaTrashAlt />
                      </DeleteIconButton>
                    </ActionsCell>
                  </tr>
                ))
              )}
            </Tbody>
          </Table>
        </TableScroll>
      </TableCard>

      {pendingAction && (
        <ConfirmModal
          title={pendingAction.type === 'unrecognized' ? '인식안됨 처리 확인' : '기록 삭제 확인'}
          message={
            pendingAction.type === 'unrecognized'
              ? '이 차량을 인식안됨 처리하시겠습니까?'
              : '정말 이 기록을 구글 시트에서 삭제하시겠습니까?'
          }
          confirmLabel={pendingAction.type === 'unrecognized' ? '인식안됨 처리' : '삭제'}
          variant={pendingAction.type === 'unrecognized' ? 'warning' : 'danger'}
          onConfirm={runPendingAction}
          onCancel={() => setPendingAction(null)}
        />
      )}
    </div>
  );
};
