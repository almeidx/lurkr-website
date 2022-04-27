import type { ReactNode } from 'react';

interface FieldsetProps {
  children: ReactNode;
}

export default function Input({ children, ...props }: FieldsetProps): JSX.Element {
  return (
    <fieldset className="flex flex-col gap-6 py-7 px-4 w-full bg-discord-slightly-darker rounded-xl" {...props}>
      {children}
    </fieldset>
  );
}
