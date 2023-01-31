export default function Subtitle({ text }: SubtitleProps) {
	return <p className="mt-1 text-xs text-gray-300">{text}</p>;
}

interface SubtitleProps {
	text: string;
}
