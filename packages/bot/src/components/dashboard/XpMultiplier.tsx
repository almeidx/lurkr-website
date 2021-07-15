import type { Snowflake } from 'discord-api-types';
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
  return (
    <div className="relative flex flex-row flex-wrap justify-between w-full py-2 gap-y-2 bg-discord-dark rounded-lg">
      <div className="flex justify-between w-full">
        <label
          className="text-white font-bold flex items-center min-w-[4rem] ml-4"
          htmlFor={`multiplier-${index}-selector`}
        >
          {type[0].toUpperCase() + type.slice(1)}
        </label>

        <div className="w-[6rem] mx-auto">
          <Input
            id={`multiplier-${index}-input`}
            initialValue={multiplier.toString()}
            maxLength={5}
            onChange={(text) => onMultiplierChange(text, index)}
            placeholder="x1.0"
            noClearButton
          />
        </div>

        <div
          className="h-full w-6 right-0 my-auto mr-4 py-3 text-2xl text-discord-red active:text-red-600 transition-colors cursor-pointer"
          onClick={() => onDelete(index)}
        >
          <MdClear />
        </div>
      </div>

      {type !== 'global' && (
        <div className="w-full mx-2">
          <Selector
            id={`multiplier-${index}-selector`}
            limit={50}
            initialItems={targets!}
            items={type === 'channel' ? channels : roles}
            onSelect={(i) => onItemChange(i, index)}
            type={type}
          />
        </div>
      )}
    </div>
  );
}
