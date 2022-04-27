import { MdClear } from 'react-icons/md';

export type XpDisallowedPrefixOnDeleteFn = (index: number) => unknown;

interface XpDisallowedPrefixProps {
  index: number;
  prefix: string;
  onDelete: XpDisallowedPrefixOnDeleteFn;
}

export default function XpDisallowedPrefix({ index, prefix, onDelete }: XpDisallowedPrefixProps) {
  return (
    <div className="flex relative flex-row flex-wrap gap-y-2 justify-between p-2 bg-discord-dark rounded-lg">
      <label
        className="flex shrink-0 justify-center items-center px-4 mr-2 text-white bg-discord-not-quite-black rounded-full shadow-lg"
        htmlFor={`${index}-disallowed-prefix`}
      >
        {prefix}
      </label>
      <MdClear onClick={() => onDelete(index)} className="py-3 ml-auto w-8 h-12 text-red-500 cursor-pointer" />
    </div>
  );
}
