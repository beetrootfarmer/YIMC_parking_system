import { useState } from 'react';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParkingData } from '../hooks/useParkingData';
import { LockScreen } from '../components/LockScreen';
import type { UserRole } from '../types';

interface RequireAuthProps {
  role: UserRole;
  children: ReactNode;
}

const ROLE_CONFIG: Record<UserRole, { title: string; description: string }> = {
  tablet: { title: '태블릿 잠금 해제', description: '태블릿 모드를 실행하려면 비밀번호를 입력하세요.' },
  admin: { title: '관리자 PC 로그인', description: '관리자 권한 인증을 위해 비밀번호를 입력하세요.' },
};

// Wraps a route so it stays behind a password screen. Auth state lives here
// as component state, so it resets automatically whenever the route unmounts
// (e.g. navigating back to "/") and persists across nested child-route changes
// (e.g. /admin <-> /admin/settings) since this component doesn't remount then.
export const RequireAuth = ({ role, children }: RequireAuthProps) => {
  const [isLocked, setIsLocked] = useState(true);
  const navigate = useNavigate();
  const { settings } = useParkingData();

  if (isLocked) {
    const targetPassword = role === 'tablet' ? settings.tabletPassword : settings.adminPassword;
    return (
      <LockScreen
        title={ROLE_CONFIG[role].title}
        description={ROLE_CONFIG[role].description}
        onSubmit={(password) => {
          const isCorrect = password === targetPassword;
          if (isCorrect) setIsLocked(false);
          return isCorrect;
        }}
        onBack={() => navigate('/')}
      />
    );
  }

  return <>{children}</>;
};
