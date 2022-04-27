import { RiErrorWarningFill } from 'react-icons/ri';

interface MessageProps {
  message: string;
  type?: 'error' | 'warning';
}

export default function Message({ message, type = 'error' }: MessageProps) {
  return (
    <div
      className={`flex flex-row gap-1.5 items-center px-2 py-1.5 rounded-lg ${
        type === 'error' ? 'bg-red-500' : 'bg-[#f77d05]'
      } text-white`}
    >
      <RiErrorWarningFill className="shrink-0 w-6 h-6 fill-current" />
      <span>{message}</span>
    </div>
  );
}
