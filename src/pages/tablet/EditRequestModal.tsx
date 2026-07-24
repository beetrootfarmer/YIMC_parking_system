import { useState } from 'react';
import type { FormEvent } from 'react';
import styled from 'styled-components';
import { ModalOverlay, ModalCard, Button, Input, Select } from '../../styles/shared';
import { FormField } from '../../components/FormField';
import type { ParkingRequest, UpdateRequestInput } from '../../types';

const Title = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.gray800};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray200};
  padding-bottom: 0.5rem;
  margin: 0 0 1rem;
`;

const Fields = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  padding-top: 0.5rem;
`;

const ErrorText = styled.p`
  color: ${({ theme }) => theme.colors.red600};
  font-size: 0.875rem;
  margin: 0;
`;

const USAGE_TIMES = ['1시간', '2시간', '3시간', '4시간', '5시간', '종일 (행사)'];

interface EditRequestModalProps {
  request: ParkingRequest;
  onSave: (input: UpdateRequestInput) => Promise<boolean>;
  onClose: () => void;
}

export const EditRequestModal = ({ request, onSave, onClose }: EditRequestModalProps) => {
  const [course, setCourse] = useState(request.course);
  const [usageTime, setUsageTime] = useState(request.usageTime);
  const [name, setName] = useState(request.name);
  const [carNumber, setCarNumber] = useState(request.carNumber);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!course || !usageTime || !name || !carNumber) {
      setError('모든 항목을 입력해주세요.');
      return;
    }
    setError('');
    await onSave({ id: request.id, course, usageTime, name, carNumber });
  };

  return (
    <ModalOverlay>
      <ModalCard>
        <Title>접수 내역 수정</Title>
        <form onSubmit={handleSubmit}>
          <Fields>
            <FormField label="시설/강좌명">
              <Input type="text" value={course} onChange={(e) => setCourse(e.target.value)} />
            </FormField>
            <FormField label="이용 시간">
              <Select value={usageTime} onChange={(e) => setUsageTime(e.target.value)}>
                {USAGE_TIMES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </Select>
            </FormField>
            <FormField label="이름">
              <Input type="text" value={name} onChange={(e) => setName(e.target.value)} />
            </FormField>
            <FormField label="차량 번호">
              <Input type="text" value={carNumber} onChange={(e) => setCarNumber(e.target.value)} />
            </FormField>
          </Fields>
          {error && <ErrorText>{error}</ErrorText>}
          <ButtonRow>
            <Button type="button" $variant="neutral" onClick={onClose}>
              닫기
            </Button>
            <Button type="submit" $variant="primary">
              수정 저장
            </Button>
          </ButtonRow>
        </form>
      </ModalCard>
    </ModalOverlay>
  );
};
