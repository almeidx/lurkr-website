import type { ReactNode } from 'react';

interface FieldProps {
  direction?: string;
  children: ReactNode;
}

export default function Input({ children, direction, ...props }: FieldProps): JSX.Element {
  return (
    <div className={`${direction === 'row' ? 'flex-row' : 'flex-col'} flex w-full`} {...props}>
      {children}
    </div>
  );
}
