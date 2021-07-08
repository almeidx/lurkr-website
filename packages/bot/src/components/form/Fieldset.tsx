import type { ReactNode } from 'react';

interface FieldsetProps {
  children: ReactNode;
}

export default function Input({ children, ...props }: FieldsetProps): JSX.Element {
  return (
    <fieldset className="flex flex-col bg-discord-slightly-darker rounded-xl w-full px-4 py-7 gap-6" {...props}>
      {children}
    </fieldset>
  );
}
