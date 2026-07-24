import styled from 'styled-components';
import { FaClipboardList, FaClock, FaSatelliteDish } from 'react-icons/fa';
import { pulse } from '../../styles/keyframes';
import { GlassCard, Button } from '../../styles/shared';
import { StatusBadge } from '../../components/StatusBadge';
import { formatTime } from '../../utils/format';
import { maskCarNumber, maskName } from '../../utils/mask';
import type { ParkingRequest } from '../../types';

const Panel = styled(GlassCard)`
  width: 100%;
  border-radius: 1rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  overflow: hidden;

  @media (min-width: 768px) {
    width: 33.333%;
    height: calc(100vh - 4rem);
  }
`;

const PanelHeader = styled.div`
  background: ${({ theme }) => theme.colors.slate800};
  color: ${({ theme }) => theme.colors.white};
  padding: 1.25rem;
  text-align: center;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
`;

const HeaderTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  svg {
    animation: ${pulse} 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }
`;

const HeaderHint = styled.p`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.slate300};
  margin: 0.25rem 0 0;
`;

const ListArea = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  background: ${({ theme }) => theme.colors.slate50};
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const EmptyState = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.gray400};

  svg {
    font-size: 3rem;
    margin-bottom: 1rem;
    opacity: 0.5;
  }
`;

const RequestCard = styled.div<{ $pending: boolean }>`
  padding: 1rem;
  border-radius: 0.75rem;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  border-left: 4px solid ${({ theme, $pending }) => ($pending ? theme.colors.yellow400 : theme.colors.green500)};
  background: ${({ theme, $pending }) => ($pending ? theme.colors.white : theme.colors.green50)};
  opacity: ${({ $pending }) => ($pending ? 1 : 0.8)};
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.15s;
`;

const CarInfoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.25rem;
`;

const CarNumberText = styled.span`
  font-weight: 700;
  color: ${({ theme }) => theme.colors.gray800};
  font-size: 1.125rem;
`;

const NameText = styled.span`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.gray500};
`;

const TimeText = styled.div`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.gray400};
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const ActionsColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.25rem;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.25rem;
  margin-top: 0.25rem;

  ${Button} {
    font-size: 0.75rem;
    padding: 0.25rem 0.5rem;
  }
`;

interface LiveRequestPanelProps {
  requests: ParkingRequest[];
  onEdit: (request: ParkingRequest) => void;
  onRequestCancel: (request: ParkingRequest) => void;
}

export const LiveRequestPanel = ({ requests, onEdit, onRequestCancel }: LiveRequestPanelProps) => (
  <Panel>
    <PanelHeader>
      <HeaderTitle>
        <FaSatelliteDish /> 실시간 접수 현황
      </HeaderTitle>
      <HeaderHint>대기중 건은 수정/취소가 가능합니다.</HeaderHint>
    </PanelHeader>

    <ListArea>
      {requests.length === 0 ? (
        <EmptyState>
          <FaClipboardList />
          <p>오늘 접수된 내역이 없습니다.</p>
        </EmptyState>
      ) : (
        [...requests].reverse().map((req) => (
          <RequestCard key={req.id} $pending={req.status === '대기중'}>
            <div>
              <CarInfoRow>
                <CarNumberText>{maskCarNumber(req.carNumber)}</CarNumberText>
                <NameText>({maskName(req.name)})</NameText>
              </CarInfoRow>
              <TimeText>
                <FaClock /> {formatTime(req.timestamp)} 접수
              </TimeText>
            </div>

            <ActionsColumn>
              <StatusBadge status={req.status} variant="tablet" />
              {req.status === '대기중' && (
                <ActionButtons>
                  <Button type="button" $variant="neutral" onClick={() => onEdit(req)}>
                    수정
                  </Button>
                  <Button type="button" $variant="softDanger" onClick={() => onRequestCancel(req)}>
                    취소
                  </Button>
                </ActionButtons>
              )}
            </ActionsColumn>
          </RequestCard>
        ))
      )}
    </ListArea>
  </Panel>
);
