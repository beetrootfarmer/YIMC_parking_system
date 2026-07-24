import { keyframes } from 'styled-components';

export const pulseSlow = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
`;

export const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
`;

export const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

export const bounce = keyframes`
  0%, 100% { transform: translateY(-25%) translateX(-50%); animation-timing-function: cubic-bezier(0.8, 0, 1, 1); }
  50% { transform: translateY(0) translateX(-50%); animation-timing-function: cubic-bezier(0, 0, 0.2, 1); }
`;
