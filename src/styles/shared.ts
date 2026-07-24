import styled, { css } from 'styled-components';

export const GlassCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.18);
`;

type ButtonVariant = 'primary' | 'dark' | 'neutral' | 'softDanger' | 'danger' | 'warning';

const buttonVariants: Record<ButtonVariant, ReturnType<typeof css>> = {
  primary: css`
    background: ${({ theme }) => theme.colors.blue600};
    color: ${({ theme }) => theme.colors.white};
    &:hover {
      background: ${({ theme }) => theme.colors.blue700};
    }
  `,
  dark: css`
    background: ${({ theme }) => theme.colors.slate800};
    color: ${({ theme }) => theme.colors.white};
    &:hover {
      background: ${({ theme }) => theme.colors.slate900};
    }
  `,
  neutral: css`
    background: ${({ theme }) => theme.colors.gray200};
    color: ${({ theme }) => theme.colors.gray700};
    &:hover {
      background: ${({ theme }) => theme.colors.gray300};
    }
  `,
  softDanger: css`
    background: ${({ theme }) => theme.colors.red100};
    color: ${({ theme }) => theme.colors.red600};
    &:hover {
      background: ${({ theme }) => theme.colors.red200};
    }
  `,
  danger: css`
    background: ${({ theme }) => theme.colors.red600};
    color: ${({ theme }) => theme.colors.white};
    &:hover {
      background: #b91c1c;
    }
  `,
  warning: css`
    background: ${({ theme }) => theme.colors.orange500};
    color: ${({ theme }) => theme.colors.white};
    &:hover {
      background: ${({ theme }) => theme.colors.orange600};
    }
  `,
};

export const Button = styled.button<{ $variant?: ButtonVariant; $fullWidth?: boolean }>`
  border: none;
  border-radius: 0.5rem;
  font-weight: 700;
  cursor: pointer;
  padding: 0.5rem 1rem;
  transition: background-color 0.15s, transform 0.1s;
  width: ${({ $fullWidth }) => ($fullWidth ? '100%' : 'auto')};

  ${({ $variant = 'primary' }) => buttonVariants[$variant]}

  &:disabled {
    background: ${({ theme }) => theme.colors.gray400};
    cursor: not-allowed;
  }

  &:active {
    transform: scale(0.98);
  }
`;

export const LinkButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.slate400};
  font-size: 0.875rem;
  text-decoration: underline;
  cursor: pointer;

  &:hover {
    color: ${({ theme }) => theme.colors.slate600};
  }
`;

export const Input = styled.input<{ $size?: 'lg' | 'md' }>`
  width: 100%;
  font-family: inherit;
  border-radius: ${({ $size }) => ($size === 'lg' ? '0.75rem' : '0.5rem')};
  border: ${({ $size }) => ($size === 'lg' ? '2px' : '1px')} solid ${({ theme }) => theme.colors.gray200};
  padding: ${({ $size }) => ($size === 'lg' ? '1rem' : '0.75rem')};
  font-size: ${({ $size }) => ($size === 'lg' ? '1.125rem' : '1rem')};
  font-weight: ${({ $size }) => ($size === 'lg' ? 500 : 400)};
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  transition: border-color 0.15s;
  outline: none;

  &:focus {
    border-color: ${({ theme }) => theme.colors.blue500};
  }
`;

export const Select = styled.select<{ $size?: 'lg' | 'md' }>`
  width: 100%;
  font-family: inherit;
  border-radius: ${({ $size }) => ($size === 'lg' ? '0.75rem' : '0.5rem')};
  border: ${({ $size }) => ($size === 'lg' ? '2px' : '1px')} solid ${({ theme }) => theme.colors.gray200};
  padding: ${({ $size }) => ($size === 'lg' ? '1rem' : '0.75rem')};
  font-size: ${({ $size }) => ($size === 'lg' ? '1.125rem' : '1rem')};
  font-weight: ${({ $size }) => ($size === 'lg' ? 500 : 400)};
  background: ${({ theme }) => theme.colors.white};
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  appearance: none;
  outline: none;
  transition: border-color 0.15s;

  &:focus {
    border-color: ${({ theme }) => theme.colors.blue500};
  }
`;

export const FieldLabel = styled.label<{ $size?: 'lg' | 'md' }>`
  display: block;
  color: ${({ theme }) => theme.colors.gray700};
  font-weight: 700;
  margin-bottom: 0.5rem;
  font-size: ${({ $size }) => ($size === 'lg' ? '1.125rem' : '0.875rem')};
`;

export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
  padding: 1rem;
`;

export const ModalCard = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border-radius: 1rem;
  padding: 1.5rem;
  max-width: 28rem;
  width: 100%;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
`;
