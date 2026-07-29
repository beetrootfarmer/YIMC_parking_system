import styled from 'styled-components';
import { FaCheck, FaExclamationCircle, FaExclamationTriangle, FaSpinner } from 'react-icons/fa';
import { pulse, spin } from '../styles/keyframes';
import type { RequestStatus } from '../types';

const Pill = styled.span<{ $status: RequestStatus; $bordered?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 700;

  ${({ theme, $status }) => {
    if ($status === '대기중') {
      return `background: ${theme.colors.yellow100}; color: ${theme.colors.yellow800};`;
    }
    if ($status === '인식안됨') {
      return `background: ${theme.colors.red100}; color: ${theme.colors.red800};`;
    }
    return `background: ${theme.colors.green100}; color: ${theme.colors.green800};`;
  }}

  ${({ theme, $bordered, $status }) =>
    $bordered
      ? `border: 1px solid ${
          $status === '대기중' ? theme.colors.yellow400 : $status === '인식안됨' ? theme.colors.red200 : theme.colors.green100
        };`
      : ''}
`;

const Dot = styled.span`
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 9999px;
  background: ${({ theme }) => theme.colors.yellow500};
  animation: ${pulse} 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
`;

const SpinningIcon = styled(FaSpinner)`
  animation: ${spin} 1s linear infinite;
`;

const LABELS: Record<'tablet' | 'admin', Record<RequestStatus, string>> = {
  tablet: { 대기중: '승인중', 인식안됨: '인식안됨 (사무실 문의)', 완료: '처리완료' },
  admin: { 대기중: '승인중', 인식안됨: '인식안됨', 완료: '완료' },
};

interface StatusBadgeProps {
  status: RequestStatus;
  variant?: 'tablet' | 'admin';
}

export const StatusBadge = ({ status, variant = 'admin' }: StatusBadgeProps) => (
  <Pill $status={status} $bordered={variant === 'admin'}>
    {status === '대기중' ? (
      variant === 'tablet' ? (
        < />
      ) : (
        <Dot />
      )
    ) : status === '인식안됨' ? (
      variant === 'tablet' ? <FaExclamationCircle /> : <FaExclamationTriangle />
    ) : (
      <FaCheck />
    )}
    {LABELS[variant][status]}
  </Pill>
);
