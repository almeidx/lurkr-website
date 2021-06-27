import { BsFillQuestionCircleFill } from 'react-icons/bs';

interface LabelProps {
  htmlFor: string;
  name: string;
  url: string;
}

export default function Label({ htmlFor, name, url }: LabelProps) {
  return (
    <label className="text-gray-300 flex gap-2 items-center text-center" htmlFor={htmlFor}>
      {name}
      <BsFillQuestionCircleFill
        className="w-4 h-4 cursor-pointer text-gray-200 fill-current duration-100 hover:text-gray-400"
        onClick={() => window.open(url)}
      />
    </label>
  );
}
