import { RiErrorWarningFill } from 'react-icons/ri';

interface ErrorMessageProps {
  message: string;
}

export default function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div className="flex flex-row gap-1.5 flex-shrink-0 items-center px-2 py-1.5 rounded-lg bg-red-500 text-white">
      <RiErrorWarningFill className="h-6 w-6 fill-current" />
      <span>{message}</span>
    </div>
  );
}
