import type { ReactChild, ReactChildren } from 'react';

interface FieldProps {
  direction?: string;
  children: ReactChild | ReactChild[] | ReactChildren | ReactChildren[];
}

export default function Input({ children, direction, ...props }: FieldProps): JSX.Element {
  return (
    <div className={`${direction === 'row' ? 'flex-row' : 'flex-col'} flex w-full`} {...props}>
      {children}
    </div>
  );
}
