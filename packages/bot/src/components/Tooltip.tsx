import { BsFillQuestionCircleFill } from 'react-icons/bs';

interface TooltipProps {
  text: string;
}

export default function Tooltip({ text }: TooltipProps) {
  return (
    <div className="group relative w-max h-max">
      <BsFillQuestionCircleFill className="w-4 h-4 cursor-pointer text-gray-200 fill-current duration-100 hover:text-gray-400" />

      <div className="group absolute hidden group-hover:block bottom-full bg-black transition-colors rounded-md left-1/2 -translate-x-1/2 mb-2">
        <p className="text-white px-3 py-2 w-72">{text}</p>
        <div className="relative">
          <div className="absolute border-4 border-black group-active:border-gray-800 transition-colors rotate-45 -top-1 left-1/2 -translate-x-1/2" />
        </div>
      </div>
    </div>
  );
}
