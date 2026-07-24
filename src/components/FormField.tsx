import type { ReactNode } from 'react';
import { FieldLabel } from '../styles/shared';

interface FormFieldProps {
  label: string;
  size?: 'lg' | 'md';
  children: ReactNode;
}

export const FormField = ({ label, size = 'md', children }: FormFieldProps) => (
  <div>
    <FieldLabel $size={size}>{label}</FieldLabel>
    {children}
  </div>
);
