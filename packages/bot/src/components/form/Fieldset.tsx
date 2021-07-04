import type { ReactChild, ReactChildren } from 'react';

interface FieldsetProps {
  children: ReactChild | ReactChild[] | ReactChildren | ReactChildren[];
}

export default function Input(props: FieldsetProps): JSX.Element {
  return (
    <fieldset className="flex flex-col bg-discord-slightly-darker rounded-xl w-full px-4 py-7 gap-6" {...props}>
      {props.children}
    </fieldset>
  );
}
