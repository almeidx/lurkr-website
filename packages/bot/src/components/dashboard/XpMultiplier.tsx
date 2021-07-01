import type { Snowflake } from 'discord-api-types';
import { useState } from 'react';
import { MdClear } from 'react-icons/md';

import type { Channel, Multiplier, Role } from '../../graphql/queries/UserGuild';
import Input from '../Input';
import Selector from './Selector';

export type XpMultiplierOnDeleteFn = (index: number) => unknown;
export type XpMultiplierOnItemChangeFn = (itemId: Snowflake, index: number, type: 'add' | 'remove') => unknown;
export type XpMultiplierOnMultiplierChangeFn = (multiplier: string, index: number) => unknown;

interface XpMultiplierProps {
  channels: Channel[];
  index: number;
  multiplier: string;
  onDelete: XpMultiplierOnDeleteFn;
  onItemChange: XpMultiplierOnItemChangeFn;
  onMultiplierChange: XpMultiplierOnMultiplierChangeFn;
  targets: Snowflake[] | null;
  roles: Role[];
  type: Multiplier['type'];
}

export default function XpMultiplier({
  channels,
  index,
  multiplier,
  onDelete,
  onItemChange,
  onMultiplierChange,
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
          onChange={({ target }) => {
            onMultiplierChange(target.value, index);
            setMultiplierValue(target.value);
          }}
          onClear={() => {
            onMultiplierChange('', index);
            setMultiplierValue('');
          }}
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
            onSelect={(itemId, type) => onItemChange(itemId, index, type)}
            type={type}
          />
        )}
      </div>

      <div
        className="absolute right-0 my-auto mx-4 py-3 text-2xl text-discord-red active:text-red-600 transition-colors h-full cursor-pointer"
        onClick={() => onDelete(index)}
      >
        <MdClear />
      </div>
    </div>
  );
}
