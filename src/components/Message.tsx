import { RiErrorWarningFill } from 'react-icons/ri';

interface MessageProps {
  message: string;
  type?: 'error' | 'warning';
}

export default function Message({ message, type = 'error' }: MessageProps) {
  return (
    <div
      className={`flex flex-row items-center gap-1.5 rounded-lg px-2 py-1.5 ${
        type === 'error' ? 'bg-red-500' : 'bg-[#f77d05]'
      } text-white`}
    >
      <RiErrorWarningFill className="h-6 w-6 shrink-0 fill-current" />
      <span>{message}</span>
    </div>
  );
}
