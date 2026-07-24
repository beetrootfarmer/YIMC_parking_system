import { useState } from 'react';
import type { KeyboardEvent } from 'react';
import styled from 'styled-components';
import { FaBuilding, FaLock, FaTimes } from 'react-icons/fa';
import { useParkingData } from '../../hooks/useParkingData';
import { Button, Input } from '../../styles/shared';
import { FormField } from '../../components/FormField';
import { Toast } from '../../components/Toast';
import type { ToastState } from '../../types';

const Wrapper = styled.div`
  max-width: 48rem;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const Card = styled.div`
  background: ${({ theme }) => theme.colors.white};
  padding: 1.5rem;
  border-radius: 1rem;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  border: 1px solid ${({ theme }) => theme.colors.slate200};
`;

const CardTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.slate800};
  border-bottom: 1px solid ${({ theme }) => theme.colors.slate200};
  padding-bottom: 1rem;
  margin: 0 0 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  svg {
    color: ${({ theme }) => theme.colors.slate400};
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;

  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const AddCourseRow = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const CourseListBox = styled.div`
  background: ${({ theme }) => theme.colors.slate50};
  border: 1px solid ${({ theme }) => theme.colors.slate200};
  border-radius: 0.5rem;
  padding: 1rem;
  min-height: 9.375rem;
`;

const EmptyText = styled.p`
  text-align: center;
  color: ${({ theme }) => theme.colors.slate400};
  padding: 1rem 0;
`;

const CourseChips = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const Chip = styled.span`
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.slate300};
  color: ${({ theme }) => theme.colors.slate700};
  padding: 0.375rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
`;

const ChipRemoveButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.slate400};
  cursor: pointer;
  display: inline-flex;

  &:hover {
    color: ${({ theme }) => theme.colors.red500};
  }
`;

const SaveRow = styled.div`
  display: flex;
  justify-content: flex-end;
  padding-top: 1rem;
`;

export const SettingsPage = () => {
  const { settings, saveSettings } = useParkingData({ polling: false });

  const [newCourse, setNewCourse] = useState('');
  const [tempCourses, setTempCourses] = useState<string[]>(() => [...settings.courses]);
  const [tempTabletPassword, setTempTabletPassword] = useState(settings.tabletPassword);
  const [tempAdminPassword, setTempAdminPassword] = useState(settings.adminPassword);
  const [toast, setToast] = useState<ToastState | null>(null);

  const handleAddCourse = () => {
    const trimmed = newCourse.trim();
    if (trimmed && !tempCourses.includes(trimmed)) {
      setTempCourses([...tempCourses, trimmed]);
      setNewCourse('');
    }
  };

  const handleRemoveCourse = (course: string) => {
    setTempCourses(tempCourses.filter((c) => c !== course));
  };

  const handleAddCourseKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleAddCourse();
  };

  const handleSave = async () => {
    const success = await saveSettings(tempCourses, tempTabletPassword, tempAdminPassword);
    setToast(
      success
        ? { message: '설정이 구글 시트에 저장되었습니다.', type: 'success' }
        : { message: '설정 저장에 실패했습니다.', type: 'error' },
    );
  };

  return (
    <Wrapper>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <Card>
        <CardTitle>
          <FaLock /> 보안 및 비밀번호 설정
        </CardTitle>
        <Grid>
          <FormField label="안내데스크 태블릿 잠금 비밀번호">
            <Input
              type="text"
              value={tempTabletPassword}
              onChange={(e) => setTempTabletPassword(e.target.value)}
              placeholder="예: 0000"
            />
          </FormField>
          <FormField label="관리자 PC 접속 비밀번호">
            <Input
              type="text"
              value={tempAdminPassword}
              onChange={(e) => setTempAdminPassword(e.target.value)}
              placeholder="예: 1234"
            />
          </FormField>
        </Grid>
      </Card>

      <Card>
        <CardTitle>
          <FaBuilding /> 대관 시설 및 강좌 목록 관리
        </CardTitle>

        <AddCourseRow>
          <Input
            type="text"
            value={newCourse}
            onChange={(e) => setNewCourse(e.target.value)}
            onKeyDown={handleAddCourseKeyDown}
            placeholder="새로운 시설명 또는 강좌명 입력"
          />
          <Button type="button" $variant="dark" onClick={handleAddCourse} style={{ whiteSpace: 'nowrap' }}>
            추가
          </Button>
        </AddCourseRow>

        <CourseListBox>
          {tempCourses.length === 0 ? (
            <EmptyText>등록된 목록이 없습니다.</EmptyText>
          ) : (
            <CourseChips>
              {tempCourses.map((course) => (
                <Chip key={course}>
                  {course}
                  <ChipRemoveButton type="button" onClick={() => handleRemoveCourse(course)}>
                    <FaTimes />
                  </ChipRemoveButton>
                </Chip>
              ))}
            </CourseChips>
          )}
        </CourseListBox>
      </Card>

      <SaveRow>
        <Button type="button" $variant="primary" onClick={handleSave} style={{ padding: '0.75rem 2rem' }}>
          설정 저장하기
        </Button>
      </SaveRow>
    </Wrapper>
  );
};
