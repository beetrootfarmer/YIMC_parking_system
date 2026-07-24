import { useState } from 'react';
import type { FormEvent } from 'react';
import styled from 'styled-components';
import { FaLock } from 'react-icons/fa';
import { Button, LinkButton } from '../styles/shared';

const Screen = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.slate900};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
`;

const Card = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border-radius: 1rem;
  padding: 2rem;
  max-width: 24rem;
  width: 100%;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  text-align: center;
`;

const IconCircle = styled.div`
  width: 4rem;
  height: 4rem;
  border-radius: 9999px;
  background: ${({ theme }) => theme.colors.blue100};
  color: ${({ theme }) => theme.colors.blue600};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  margin: 0 auto 1.5rem;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.gray800};
  margin: 0 0 0.5rem;
`;

const Description = styled.p`
  color: ${({ theme }) => theme.colors.slate500};
  font-size: 0.875rem;
  margin: 0 0 1.5rem;
`;

const PasswordInput = styled.input<{ $hasError?: boolean }>`
  width: 100%;
  text-align: center;
  font-size: 1.25rem;
  font-family: ui-monospace, monospace;
  letter-spacing: 0.2em;
  padding: 1rem;
  border: 1px solid ${({ theme, $hasError }) => ($hasError ? theme.colors.red500 : theme.colors.slate300)};
  border-radius: 0.75rem;
  margin-bottom: 0.5rem;
  outline: none;

  &:focus {
    box-shadow: 0 0 0 2px ${({ theme, $hasError }) => ($hasError ? theme.colors.red500 : theme.colors.blue500)};
  }
`;

const ErrorText = styled.p`
  color: ${({ theme }) => theme.colors.red600};
  font-size: 0.875rem;
  margin: 0 0 1rem;
`;

interface LockScreenProps {
  title: string;
  description: string;
  onSubmit: (password: string) => boolean;
  onBack: () => void;
}

export const LockScreen = ({ title, description, onSubmit, onBack }: LockScreenProps) => {
  const [password, setPassword] = useState('');
  const [hasError, setHasError] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const isCorrect = onSubmit(password);
    setHasError(!isCorrect);
    setPassword('');
  };

  return (
    <Screen>
      <Card>
        <IconCircle>
          <FaLock />
        </IconCircle>
        <Title>{title}</Title>
        <Description>{description}</Description>
        <form onSubmit={handleSubmit}>
          <PasswordInput
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (hasError) setHasError(false);
            }}
            placeholder="비밀번호 입력"
            $hasError={hasError}
            autoFocus
          />
          {hasError && <ErrorText>비밀번호가 틀렸습니다.</ErrorText>}
          <Button type="submit" $variant="dark" $fullWidth style={{ padding: '1rem', borderRadius: '0.75rem' }}>
            접속하기
          </Button>
        </form>
        <div style={{ marginTop: '1rem' }}>
          <LinkButton type="button" onClick={onBack}>
            처음으로 돌아가기
          </LinkButton>
        </div>
      </Card>
    </Screen>
  );
};
