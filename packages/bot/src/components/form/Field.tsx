import type { ReactChild, ReactChildren } from 'react';

interface FieldProps {
  direction?: string;
  children: ReactChild | ReactChild[] | ReactChildren | ReactChildren[];
}

export default function Input(props: FieldProps): JSX.Element {
  return (
    <div className={`${props.direction === 'row' ? 'flex-row' : 'flex-col'} flex w-full`} {...props}>
      {props.children}
    </div>
  );
}
