import { BsFillQuestionCircleFill } from "react-icons/bs";

export default function Tooltip({ text }: TooltipProps) {
	return (
		<div className="group relative h-max w-max">
			<BsFillQuestionCircleFill className="h-4 w-4 cursor-pointer fill-current text-gray-200 transition-colors hover:text-gray-400" />

			<div className="group absolute bottom-full left-1/2 mb-2 hidden -translate-x-1/2 rounded-md bg-black transition-colors group-hover:block">
				<p className="w-72 px-3 py-2 leading-5 text-white">{text}</p>
				<div className="relative">
					<div className="absolute -top-1 left-1/2 -translate-x-1/2 rotate-45 border-4 border-black transition-colors group-active:border-gray-800" />
				</div>
			</div>
		</div>
	);
}

interface TooltipProps {
	text: string;
}
