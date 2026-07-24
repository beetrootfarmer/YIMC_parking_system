import { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { FaCog, FaHome, FaListUl, FaSync } from 'react-icons/fa';
import { spin } from '../../styles/keyframes';
import { useParkingData } from '../../hooks/useParkingData';
import { playNotificationSound } from '../../lib/audio';

const Screen = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.slate100};
  display: flex;
  flex-direction: column;
`;

const Nav = styled.nav`
  background: ${({ theme }) => theme.colors.white};
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  padding: 1rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  z-index: 10;
`;

const NavLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const Logo = styled.img`
  height: 2rem;
  object-fit: contain;
`;

const Divider = styled.div`
  height: 1.25rem;
  width: 1px;
  background: ${({ theme }) => theme.colors.slate300};
  margin: 0 0.5rem;
`;

const NavTitle = styled.h1`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.slate800};
  margin: 0;
`;

const SpinIcon = styled(FaSync)`
  animation: ${spin} 1s linear infinite;
`;

const SyncBadge = styled.span`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.blue500};
  background: ${({ theme }) => theme.colors.blue50};
  padding: 0.125rem 0.5rem;
  border-radius: 0.25rem;
  margin-left: 0.5rem;
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
`;

const NavRight = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const NavTab = styled(NavLink)`
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-weight: 500;
  text-decoration: none;
  color: ${({ theme }) => theme.colors.slate600};
  transition: background-color 0.15s, color 0.15s;
  display: inline-flex;
  align-items: center;

  &:hover {
    background: ${({ theme }) => theme.colors.slate100};
  }

  &.active {
    background: ${({ theme }) => theme.colors.blue50};
    color: ${({ theme }) => theme.colors.blue700};
  }
`;

const Content = styled.div`
  flex: 1;
  padding: 1.5rem;
  max-width: 80rem;
  margin: 0 auto;
  width: 100%;

  @media (min-width: 768px) {
    padding: 2rem;
  }
`;

const HomeFab = styled.button`
  position: fixed;
  bottom: 1rem;
  right: 1rem;
  background: ${({ theme }) => theme.colors.slate800};
  color: ${({ theme }) => theme.colors.white};
  width: 3rem;
  height: 3rem;
  border-radius: 9999px;
  border: none;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.5;
  transition: opacity 0.15s, background-color 0.15s;
  z-index: 50;

  &:hover {
    opacity: 1;
    background: ${({ theme }) => theme.colors.slate700};
  }
`;

export const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Pause background polling while the settings screen is open, matching the
  // original app's behavior of not refreshing cloud data mid-edit.
  const isSettingsRoute = location.pathname.endsWith('/settings');
  const { isSyncing, requests } = useParkingData({ polling: !isSettingsRoute });
  const prevPendingCountRef = useRef(0);

  // Plays a notification sound whenever a new pending request arrives while
  // this admin area is mounted (i.e. the routed equivalent of the original
  // app's viewMode === 'pc' scope).
  useEffect(() => {
    const currentPending = requests.filter((r) => r.status === '대기중').length;
    if (currentPending > prevPendingCountRef.current) {
      playNotificationSound();
    }
    prevPendingCountRef.current = currentPending;
  }, [requests]);

  return (
    <Screen>
      <Nav>
        <NavLeft>
          <Logo src="https://yimc.or.kr/theme/iwootec/img/logo2.png" alt="용인미디어센터 로고" />
          <Divider />
          <NavTitle>관리자 대시보드</NavTitle>
          {isSyncing && (
            <SyncBadge>
              <SpinIcon /> 구글 동기화 중
            </SyncBadge>
          )}
        </NavLeft>

        <NavRight>
          <NavTab to="/admin" end>
            <FaListUl style={{ marginRight: '0.5rem' }} /> 주차 현황
          </NavTab>
          <NavTab to="/admin/settings">
            <FaCog style={{ marginRight: '0.5rem' }} /> 시스템 설정
          </NavTab>
        </NavRight>
      </Nav>

      <Content>
        <Outlet />
      </Content>

      <HomeFab type="button" onClick={() => navigate('/')} title="초기 선택화면으로">
        <FaHome />
      </HomeFab>
    </Screen>
  );
};
