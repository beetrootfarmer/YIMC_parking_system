import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { FaTabletAlt, FaDesktop } from 'react-icons/fa';
import { GlassCard } from '../styles/shared';
import { primeAudioContext } from '../lib/audio';

const Screen = styled.div`
  min-height: 100vh;
  background: linear-gradient(to bottom right, ${({ theme }) => theme.colors.blue900}, ${({ theme }) => theme.colors.slate800});
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
`;

const Card = styled(GlassCard)`
  border-radius: 1.5rem;
  padding: 2.5rem;
  max-width: 42rem;
  width: 100%;
  text-align: center;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
`;

const Logo = styled.img`
  height: 4rem;
  object-fit: contain;
  margin-bottom: 1.25rem;
`;

const Title = styled.h1`
  font-size: 1.875rem;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.slate800};
  margin: 0 0 0.5rem;
`;

const Subtitle = styled.p`
  color: ${({ theme }) => theme.colors.slate500};
  margin: 0;
`;

const OptionGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  margin-top: 2.5rem;

  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const OptionButton = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  border: 2px solid ${({ theme }) => theme.colors.slate200};
  background: ${({ theme }) => theme.colors.white};
  border-radius: 1rem;
  cursor: pointer;
  transition: border-color 0.15s, box-shadow 0.15s;

  &:hover {
    border-color: ${({ theme }) => theme.colors.blue500};
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  }
`;

const IconCircle = styled.div`
  width: 5rem;
  height: 5rem;
  border-radius: 9999px;
  background: ${({ theme }) => theme.colors.slate100};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
  font-size: 2.25rem;
  color: ${({ theme }) => theme.colors.slate500};
  transition: background-color 0.15s, color 0.15s;

  ${OptionButton}:hover & {
    background: ${({ theme }) => theme.colors.blue50};
    color: ${({ theme }) => theme.colors.blue600};
  }
`;

const OptionTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.slate800};
  margin: 0;
`;

const OptionDescription = styled.p`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.slate500};
  margin: 0.5rem 0 0;
`;

export const ModeSelectPage = () => {
  const navigate = useNavigate();

  return (
    <Screen>
      <Card>
        <Logo src="https://yimc.or.kr/theme/iwootec/img/logo2.png" alt="용인미디어센터 로고" />
        <Title>주차 관리 시스템</Title>
        <Subtitle>실행할 기기의 환경을 선택해주세요 (구글 시트 연동 버전).</Subtitle>

        <OptionGrid>
          <OptionButton onClick={() => navigate('/tablet')}>
            <IconCircle>
              <FaTabletAlt />
            </IconCircle>
            <OptionTitle>안내데스크 태블릿</OptionTitle>
            <OptionDescription>방문자 직접 입력용</OptionDescription>
          </OptionButton>

          <OptionButton
            onClick={() => {
              primeAudioContext();
              navigate('/admin');
            }}
          >
            <IconCircle>
              <FaDesktop />
            </IconCircle>
            <OptionTitle>사무실 관리자 PC</OptionTitle>
            <OptionDescription>현황 확인 및 승인 처리</OptionDescription>
          </OptionButton>
        </OptionGrid>
      </Card>
    </Screen>
  );
};
