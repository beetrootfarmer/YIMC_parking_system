import styled from 'styled-components';

export const IconButton = styled.button`
  color: ${({ theme }) => theme.colors.gray400};
  background: ${({ theme }) => theme.colors.gray100};
  padding: 0.5rem;
  border-radius: 0.5rem;
  border: none;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  transition: background-color 0.15s, color 0.15s;

  &:hover {
    background: ${({ theme }) => theme.colors.gray200};
    color: ${({ theme }) => theme.colors.slate600};
  }
`;
