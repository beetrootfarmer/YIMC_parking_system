import { useEffect } from 'react';
import styled from 'styled-components';
import { FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import { bounce } from '../styles/keyframes';
import type { ToastState } from '../types';

const ToastWrapper = styled.div<{ $type: ToastState['type'] }>`
  position: fixed;
  top: 1.25rem;
  left: 50%;
  background: ${({ theme, $type }) => ($type === 'error' ? theme.colors.red500 : theme.colors.green500)};
  color: ${({ theme }) => theme.colors.white};
  padding: 0.75rem 1.5rem;
  border-radius: 9999px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  z-index: 50;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  animation: ${bounce} 1s infinite;
`;

interface ToastProps {
  message: string;
  type: ToastState['type'];
  onClose: () => void;
}

export const Toast = ({ message, type, onClose }: ToastProps) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <ToastWrapper $type={type}>
      {type === 'error' ? <FaExclamationCircle /> : <FaCheckCircle />}
      <span>{message}</span>
    </ToastWrapper>
  );
};
