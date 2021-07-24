interface SubtitleProps {
  text: string;
}

export default function Subtitle({ text }: SubtitleProps) {
  return <p className="text-gray-300 text-xs mt-1">{text}</p>;
}
