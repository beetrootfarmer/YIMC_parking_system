import { useState } from 'react';
import type { FormEvent } from 'react';
import styled from 'styled-components';
import { FaCar, FaExpand, FaSpinner } from 'react-icons/fa';
import { spin } from '../../styles/keyframes';
import { GlassCard, Button, Select, Input } from '../../styles/shared';
import { IconButton } from '../../components/IconButton';
import { FormField } from '../../components/FormField';
import type { NewRequestInput, ToastState } from '../../types';

const Panel = styled(GlassCard)`
  flex: 1;
  border-radius: 1rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  display: flex;
  flex-direction: column;

  @media (min-width: 768px) {
    padding: 2rem;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const Logo = styled.img`
  height: 2.5rem;
  object-fit: contain;
`;

const TitleBlock = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const Heading = styled.h1`
  font-size: 1.875rem;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.gray800};
  margin: 0;
`;

const Subheading = styled.p`
  font-size: 1.125rem;
  color: ${({ theme }) => theme.colors.gray500};
  margin: 0.5rem 0 0;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  flex: 1;
`;

const SpinningIcon = styled(FaSpinner)`
  animation: ${spin} 1s linear infinite;
`;

const OTHER_OPTION = '직접입력';
const USAGE_TIMES = ['1시간', '2시간', '3시간', '4시간', '5시간', '종일 (행사)'];
const DEFAULT_COURSES = ['오디오 스튜디오', '스튜디오 대', '스튜디오 소', '1인 미디어실'];

interface RegistrationPanelProps {
  coursesList: string[];
  isSubmitting: boolean;
  onSubmit: (input: NewRequestInput) => Promise<boolean>;
  onToast: (toast: ToastState) => void;
}

export const RegistrationPanel = ({ coursesList, isSubmitting, onSubmit, onToast }: RegistrationPanelProps) => {
  const [courseSelection, setCourseSelection] = useState('');
  const [customCourse, setCustomCourse] = useState('');
  const [usageTime, setUsageTime] = useState('1시간');
  const [name, setName] = useState('');
  const [carNumber, setCarNumber] = useState('');

  const displayCourses = coursesList.length > 0 ? coursesList : DEFAULT_COURSES;

  const toggleFullscreen = () => {
    const docEl = document.documentElement as HTMLElement & {
      webkitRequestFullscreen?: () => void;
      msRequestFullscreen?: () => void;
    };
    const doc = document as Document & { webkitFullscreenElement?: Element; webkitExitFullscreen?: () => void; msExitFullscreen?: () => void };
    const isFullscreen = document.fullscreenElement || doc.webkitFullscreenElement;

    if (!isFullscreen) {
      if (docEl.requestFullscreen) docEl.requestFullscreen();
      else if (docEl.webkitRequestFullscreen) docEl.webkitRequestFullscreen();
      else if (docEl.msRequestFullscreen) docEl.msRequestFullscreen();
    } else {
      if (document.exitFullscreen) document.exitFullscreen();
      else if (doc.webkitExitFullscreen) doc.webkitExitFullscreen();
      else if (doc.msExitFullscreen) doc.msExitFullscreen();
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const finalCourse = courseSelection === OTHER_OPTION ? customCourse.trim() : courseSelection;

    if (!finalCourse || !usageTime || !name || !carNumber) {
      onToast({ message: '모든 항목을 입력해주세요.', type: 'error' });
      return;
    }

    const success = await onSubmit({ course: finalCourse, usageTime, name, carNumber });

    if (success) {
      setCourseSelection('');
      setCustomCourse('');
      setUsageTime('1시간');
      setName('');
      setCarNumber('');
      onToast({ message: '주차 등록이 완료되었습니다.', type: 'success' });
    } else {
      onToast({ message: '서버 연결에 실패했습니다. 다시 시도해주세요.', type: 'error' });
    }
  };

  return (
    <Panel>
      <Header>
        <IconButton type="button" onClick={toggleFullscreen} title="전체화면 전환">
          <FaExpand />
        </IconButton>
        <Logo src="https://yimc.or.kr/theme/iwootec/img/logo2.png" alt="용인미디어센터 로고" />
      </Header>

      <TitleBlock>
        <Heading>용인미디어센터</Heading>
        <Subheading>주차 등록 신청 시스템</Subheading>
      </TitleBlock>

      <Form onSubmit={handleSubmit}>
        <FormField label="대관 시설 및 강좌명" size="lg">
          <Select
            $size="lg"
            value={courseSelection}
            onChange={(e) => {
              setCourseSelection(e.target.value);
              if (e.target.value !== OTHER_OPTION) setCustomCourse('');
            }}
          >
            <option value="" disabled>
              이용하시는 시설을 선택해주세요
            </option>
            {displayCourses.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
            <option value={OTHER_OPTION}>기타 (직접 입력)</option>
          </Select>

          {courseSelection === OTHER_OPTION && (
            <div style={{ marginTop: '0.75rem' }}>
              <Input
                $size="lg"
                type="text"
                placeholder="시설명, 강좌명 또는 행사명을 직접 입력해주세요"
                value={customCourse}
                onChange={(e) => setCustomCourse(e.target.value)}
                style={{ borderColor: '#bfdbfe', background: '#eff6ff' }}
                autoFocus
              />
            </div>
          )}
        </FormField>

        <FormField label="이용 시간" size="lg">
          <Select $size="lg" value={usageTime} onChange={(e) => setUsageTime(e.target.value)}>
            {USAGE_TIMES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </Select>
        </FormField>

        <FormField label="이름" size="lg">
          <Input $size="lg" type="text" placeholder="예: 홍길동" value={name} onChange={(e) => setName(e.target.value)} />
        </FormField>

        <FormField label="차량 번호" size="lg">
          <Input
            $size="lg"
            type="text"
            placeholder="예: 12가 3456"
            value={carNumber}
            onChange={(e) => setCarNumber(e.target.value)}
          />
        </FormField>

        <div style={{ paddingTop: '1rem' }}>
          <Button
            type="submit"
            disabled={isSubmitting}
            $fullWidth
            style={{ padding: '1.25rem', borderRadius: '0.75rem', fontSize: '1.5rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.75rem' }}
          >
            {isSubmitting ? (
              <>
                <SpinningIcon /> 등록 중...
              </>
            ) : (
              <>
                <FaCar /> 주차 등록 요청하기
              </>
            )}
          </Button>
        </div>
      </Form>
    </Panel>
  );
};
