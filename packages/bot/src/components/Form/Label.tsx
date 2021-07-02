import { BsFillQuestionCircleFill } from 'react-icons/bs';

interface LabelProps {
  htmlFor: string;
  name: string;
  url: string;
}

export default function Label({ htmlFor, name, url }: LabelProps) {
  return (
    <label className="text-gray-300 flex gap-2 w-min items-center text-center whitespace-nowrap mb-2" htmlFor={htmlFor}>
      {name}
      <BsFillQuestionCircleFill
        className="w-4 h-4 cursor-pointer text-gray-200 fill-current duration-100 hover:text-gray-400"
        onClick={() => window.open(url)}
      />
    </label>
  );
}
