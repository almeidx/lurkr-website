import { MdClear } from 'react-icons/md';

export type XpDisallowedPrefixOnDeleteFn = (index: number) => unknown;

interface XpDisallowedPrefixProps {
  index: number;
  prefix: string;
  onDelete: XpDisallowedPrefixOnDeleteFn;
}

export default function XpDisallowedPrefix({ index, prefix, onDelete }: XpDisallowedPrefixProps) {
  return (
    <div className="relative flex flex-row flex-wrap justify-between p-2 gap-y-2 bg-discord-dark rounded-lg">
      <label
        className="flex flex-shrink-0 justify-center items-center rounded-full px-4 mr-2 text-white bg-discord-not-quite-black shadow-lg"
        htmlFor={`${index}-disallowed-prefix`}
      >
        {prefix}
      </label>
      <MdClear onClick={() => onDelete(index)} className="h-12 w-8 py-3 ml-auto text-red-500 cursor-pointer" />
    </div>
  );
}
