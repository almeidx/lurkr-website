import type { Snowflake } from 'discord-api-types';
import { useState } from 'react';
import { MdClear } from 'react-icons/md';

import type { Channel, Multiplier, Role } from '../../graphql/queries/UserGuild';
import Input from '../Input';
import Selector from './Selector';

interface XpMultiplierProps {
  channels: Channel[];
  index: number;
  multiplier: number;
  onClear: (index: number) => unknown;
  targets: Snowflake[] | null;
  roles: Role[];
  type: Multiplier['type'];
}

export default function XpMultiplier({
  channels,
  index,
  multiplier,
  onClear,
  roles,
  targets,
  type,
}: XpMultiplierProps) {
  const [multiplierValue, setMultiplierValue] = useState<string>(multiplier.toString());

  return (
    <div className="flex flex-row justify-between gap-3 relative w-full">
      <div className="flex flex-row gap-x-6">
        <Input
          id={`multiplier-${index}`}
          maxLength={5}
          onChange={(e) => setMultiplierValue(e.target.value)}
          onClear={() => setMultiplierValue('')}
          placeholder="x1.0"
          value={multiplierValue}
        />

        <label className="text-white flex items-center" htmlFor={`multiplier-${index}`}>
          {type[0].toUpperCase() + type.slice(1)}
        </label>

        {type !== 'global' && (
          <Selector
            id={`multiplier-${index}`}
            limit={50}
            initialItems={targets!}
            items={type === 'channel' ? channels : roles}
            onSelect={console.log}
            type={type}
          />
        )}
      </div>

      <div
        className="absolute right-0 my-auto mx-4 py-3 text-2xl text-discord-red active:text-red-600 transition-colors h-full cursor-pointer"
        onClick={() => onClear(index)}
      >
        <MdClear />
      </div>
    </div>
  );
}
