import { BsFillQuestionCircleFill } from 'react-icons/bs';

interface TooltipProps {
  text: string;
}

export default function Tooltip({ text }: TooltipProps) {
  return (
    <div className="group relative w-max h-max">
      <BsFillQuestionCircleFill className="w-4 h-4 text-gray-200 hover:text-gray-400 duration-100 cursor-pointer fill-current" />

      <div className="group hidden group-hover:block absolute bottom-full left-1/2 mb-2 bg-black rounded-md transition-colors -translate-x-1/2">
        <p className="py-2 px-3 w-72 leading-5 text-white">{text}</p>
        <div className="relative">
          <div className="absolute -top-1 left-1/2 border-4 border-black group-active:border-gray-800 transition-colors rotate-45 -translate-x-1/2" />
        </div>
      </div>
    </div>
  );
}
