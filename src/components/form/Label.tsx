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
      } flex w-min items-center gap-2 whitespace-nowrap text-center text-lg text-gray-300`}
      htmlFor={htmlFor}
    >
      {name}
      <BsFillQuestionCircleFill
        className="h-4 w-4 cursor-pointer fill-current text-gray-200 duration-100 hover:text-gray-400"
        onClick={() => window.open(url)}
      />
    </label>
  );
}
