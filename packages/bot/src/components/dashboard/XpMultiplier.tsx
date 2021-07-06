import type { Snowflake } from 'discord-api-types';
import { useState } from 'react';
import { MdClear } from 'react-icons/md';

import type { Channel, Multiplier, Role } from '../../graphql/queries/DashboardGuild';
import Input from '../form/Input';
import Selector from '../form/Selector';

export type XpMultiplierOnDeleteFn = (index: number) => unknown;
export type XpMultiplierOnItemChangeFn = (itemIds: Snowflake[], index: number) => unknown;
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
    <div className="flex flex-row justify-between gap-3 relative w-full pt-4 pb-2 first-of-type:pt-0 last-of-type:pb-0">
      <div className="flex flex-row gap-x-6">
        <Input
          id={`multiplier-${index}-input`}
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

        <label className="text-white flex items-center min-w-[4rem]" htmlFor={`multiplier-${index}-selector`}>
          {type[0].toUpperCase() + type.slice(1)}
        </label>

        {type !== 'global' && (
          <div className="min-w-[15rem]">
            <Selector
              id={`multiplier-${index}-selector`}
              limit={50}
              initialItems={targets!}
              items={type === 'channel' ? channels : roles}
              onSelect={(itemIds) => onItemChange(itemIds, index)}
              type={type}
            />
          </div>
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
