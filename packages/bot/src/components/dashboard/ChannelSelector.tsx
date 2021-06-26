import type { Snowflake } from 'discord-api-types';
import { MouseEventHandler, useEffect, useState } from 'react';
import { AiOutlinePlusCircle } from 'react-icons/ai';

import { DEFAULT_ROLE_COLOUR } from '../../utils/constants';
import Input from '../Input';

interface Channel {
  id: Snowflake;
  name: string;
}

interface ChannelSelectorProps {
  channels: Channel[];
}

export default function ChannelSelector({ channels }: ChannelSelectorProps) {
  const [selected, setSelected] = useState<Channel[]>([]);
  const [options, setOptions] = useState<Channel[]>(channels);
  const [searchTerm, setSearchTerm] = useState('');

  const handleChannelRemove: MouseEventHandler<HTMLDivElement> = (event) => {
    const channelId = (event.target as HTMLDivElement).id;
    const clone = [...selected];
    const selectedIndex = clone.findIndex((s) => s.id === channelId);

    if (selectedIndex < 0) return;

    clone.splice(selectedIndex, 1);

    setSelected(clone);
  };

  // const handleChannelInput: MouseEventHandler<HTMLDivElement> = (event) => {
  //   const channelId = (event.target as HTMLDivElement).id as Snowflake;
  //   if (!selected.some((s) => s.id === channelId)) {
  //     setOptions([...options].filter((o) => o.id !== channelId));

  //     setSelected([...selected, { id: channelId, name: channels.find((c) => c.id === channelId)!.name }]);
  //   }
  // };

  useEffect(() => {
    const searchableChannels = channels.filter((c) => !selected.some((s) => s.id === c.id));

    if (!searchTerm) {
      return setOptions(searchableChannels);
    }

    setOptions(searchableChannels.filter((c) => c.name.toLowerCase().includes(searchTerm.toLowerCase())));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, selected]);

  return (
    <div className="flex flex-row flex-wrap gap-3 bg-discord-not-quite-black px-5 py-3 focus:outline-none rounded-md shadow w-96 min-h-[3rem]">
      {selected.map(({ id, name }) => (
        <div
          className={`flex items-center font-light border-2 border-[${DEFAULT_ROLE_COLOUR}] rounded-2xl px-1.5 py-1 max-w-full cursor-pointer z-50`}
          key={id}
          id={id}
          onClick={handleChannelRemove}
        >
          <p className="text-white truncate" id={id}>
            {name}
          </p>
        </div>
      ))}

      <div className="relative">
        <AiOutlinePlusCircle className="text-white fill-current w-6 h-6 cursor-pointer" />

        <div
          className="absolute w-60 h-96 bg-[#36393f] flex flex-col items-center pt-4 mt-6 rounded-md"
          style={{ left: '-6.75rem' /* 15rem / 2 - 1.5rem / 2 */ }}
        >
          <Input
            className="pb-3"
            id="channelSelector"
            maxLength={50}
            onChange={(e) => setSearchTerm(e.target.value)}
            onClear={() => setSearchTerm('')}
            placeholder="Role name"
            value={searchTerm}
          />

          <div className="flex flex-col overflow-y-scroll gap-1">
            {options.map(({ id, name }) => (
              <div
                className="flex text-center px-4 py-2 hover:bg-discord-lighter rounded-lg cursor-pointer"
                key={id}
                // onClick={handleChannelInput}
              >
                <span className="text-white">#{name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// export default function ChannelSelector({ channels }: ChannelSelectorProps) {
//   const [selected, setSelected] = useState<Channel[]>([]);
//   const [options, setOptions] = useState<Channel[]>(channels);

//   const handleChannelRemove: MouseEventHandler<HTMLDivElement> = (event) => {
//     const channelId = (event.target as HTMLDivElement).id;
//     const clone = [...selected];
//     const selectedIndex = clone.findIndex((s) => s.id === channelId);

//     if (selectedIndex < 0) return;

//     clone.splice(selectedIndex, 1);

//     setSelected(clone);
//   };

//   const handleChannelSelect: ChangeEventHandler<HTMLSelectElement> = (event) => {
//     const channelInfo = event.target.selectedOptions[0];
//     if (!channelInfo || selected.some((s) => s.id === channelInfo.id)) return;

//     setSelected([...selected, { id: channelInfo.id as Snowflake, name: channelInfo.value }]);

//     const optionsClone = [...options];
//     const optionIndex = optionsClone.findIndex((o) => o.id === channelInfo.id);
//     if (optionIndex < 0) return;

//     optionsClone.splice(optionIndex, 1);
//     setOptions(optionsClone);
//   };

//   return (
//     <div>
//       <div className="flex flex-row flex-wrap gap-3 bg-discord-not-quite-black px-5 py-3 focus:outline-none rounded-md shadow w-96 min-h-[3rem]">
//         {selected.map(({ id, name }) => (
//           <div
//             className={`flex items-center font-light border-2 border-[${DEFAULT_ROLE_COLOUR}] rounded-2xl px-1.5 py-1 max-w-full cursor-pointer z-50`}
//             key={id}
//             id={id}
//             onClick={handleChannelRemove}
//           >
//             <p className="text-white truncate" id={id}>
//               {name}
//             </p>
//           </div>
//         ))}
//       </div>

//       <div className="block">
//         <label className="text-gray-400 font-light" htmlFor="selector">
//           Add more channels to the blacklist
//         </label>

//         <select
//           className="block mt-1 w-96 bg-discord-not-quite-black active:outline-none border-0 rounded-md text-white shadow-md h-12"
//           id="selector"
//           onChange={handleChannelSelect}
//         >
//           {options.map(({ id: channelId, name }) => (
//             <option id={channelId} key={channelId}>
//               #{name}
//             </option>
//           ))}
//         </select>
//       </div>
//     </div>
//   );
// }
