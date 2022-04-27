import { BsFillQuestionCircleFill } from 'react-icons/bs';

interface LabelProps {
  htmlFor: string;
  name: string;
  url: string;
  withMargin?: boolean;
}

export default function Label({ htmlFor, name, url, withMargin = true }: LabelProps) {
  return (
    <label
      className={`${
        withMargin ? 'mb-1' : ''
      } text-gray-300 flex gap-2 w-min items-center text-center text-lg whitespace-nowrap`}
      htmlFor={htmlFor}
    >
      {name}
      <BsFillQuestionCircleFill
        className="w-4 h-4 text-gray-200 hover:text-gray-400 duration-100 cursor-pointer fill-current"
        onClick={() => window.open(url)}
      />
    </label>
  );
}
