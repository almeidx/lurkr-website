import type { ReactNode } from 'react';

interface FieldsetProps {
  children: ReactNode;
}

export default function Input({ children, ...props }: FieldsetProps): JSX.Element {
  return (
    <fieldset className="flex w-full flex-col gap-6 rounded-xl bg-discord-slightly-darker py-7 px-4" {...props}>
      {children}
    </fieldset>
  );
}
