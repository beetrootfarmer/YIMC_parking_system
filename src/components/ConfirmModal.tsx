import type { ReactNode } from 'react';
import styled from 'styled-components';
import { FaExclamationTriangle } from 'react-icons/fa';
import { Button, ModalOverlay, ModalCard } from '../styles/shared';

const IconCircle = styled.div<{ $variant: 'danger' | 'warning' }>`
  width: 3rem;
  height: 3rem;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  font-size: 1.25rem;
  background: ${({ theme, $variant }) => ($variant === 'danger' ? theme.colors.red100 : '#ffedd5')};
  color: ${({ theme, $variant }) => ($variant === 'danger' ? theme.colors.red600 : theme.colors.orange600)};
`;

const Title = styled.h3`
  font-size: 1.125rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.gray800};
  text-align: center;
  margin: 1rem 0 0.5rem;
`;

const Message = styled.p`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.slate500};
  text-align: center;
  margin: 0 0 1rem;
  line-height: 1.5;
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 0.5rem;
  padding-top: 0.5rem;

  ${Button} {
    flex: 1;
    padding: 0.75rem;
    border-radius: 0.75rem;
  }
`;

interface ConfirmModalProps {
  title: string;
  message: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning';
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmModal = ({
  title,
  message,
  confirmLabel = '확인',
  cancelLabel = '닫기',
  variant = 'danger',
  onConfirm,
  onCancel,
}: ConfirmModalProps) => (
  <ModalOverlay>
    <ModalCard style={{ maxWidth: '24rem', textAlign: 'center' }}>
      <IconCircle $variant={variant}>
        <FaExclamationTriangle />
      </IconCircle>
      <Title>{title}</Title>
      <Message>{message}</Message>
      <ButtonRow>
        <Button type="button" $variant="neutral" onClick={onCancel}>
          {cancelLabel}
        </Button>
        <Button type="button" $variant={variant === 'danger' ? 'danger' : 'warning'} onClick={onConfirm}>
          {confirmLabel}
        </Button>
      </ButtonRow>
    </ModalCard>
  </ModalOverlay>
);
