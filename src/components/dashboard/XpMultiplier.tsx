import type { Snowflake } from 'discord-api-types';
import { MdClear } from 'react-icons/md';

import type { DashboardChannels, DashboardDatabaseGuild, DashboardRoles } from '../../graphql/queries/DashboardGuild';
import { getDatabaseLimit } from '../../utils/utils';
import Input from '../form/Input';
import Selector from '../form/Selector';

export type XpMultiplierOnDeleteFn = (id: string) => unknown;
export type XpMultiplierOnItemChangeFn = (itemIds: Snowflake[], id: string) => unknown;
export type XpMultiplierOnMultiplierChangeFn = (multiplier: string, id: string) => unknown;

interface XpMultiplierProps {
  channels: DashboardChannels;
  id: string;
  multiplier: string;
  onDelete: XpMultiplierOnDeleteFn;
  onItemChange: XpMultiplierOnItemChangeFn;
  onMultiplierChange: XpMultiplierOnMultiplierChangeFn;
  premium: boolean;
  targets: Snowflake[] | null;
  roles: DashboardRoles;
  type: DashboardDatabaseGuild['xpMultipliers'][0]['type'];
}

export default function XpMultiplier({
  channels,
  id,
  multiplier,
  onDelete,
  onItemChange,
  onMultiplierChange,
  premium,
  roles,
  targets,
  type,
}: XpMultiplierProps) {
  return (
    <div className="relative flex flex-row flex-wrap justify-between w-full p-2 gap-y-2 bg-discord-dark rounded-lg">
      <div className="flex w-full">
        <label className="text-white font-bold flex items-center w-[6rem] ml-4" htmlFor={`m-${id}-selector`}>
          {type[0].toUpperCase() + type.slice(1)}
        </label>

        <div className="w-[6rem]">
          <Input
            id={`m-${id}-input`}
            initialValue={multiplier.toString()}
            maxLength={5}
            onChange={(t) => onMultiplierChange(t, id)}
            placeholder="1.0"
            prefix="x"
            noClearButton
          />
        </div>

        <div
          className="h-full w-6 right-0 ml-auto mr-4 py-3 text-2xl text-discord-red active:text-red-600 transition-colors cursor-pointer"
          onClick={() => onDelete(id)}
        >
          <MdClear />
        </div>
      </div>

      {type !== 'global' && targets && (
        <div className="w-full mx-2">
          <Selector
            id={`m-${id}-selector`}
            limit={getDatabaseLimit('xpMultiplierTargets', premium).maxLength}
            initialItems={targets}
            items={type === 'channel' ? channels : roles}
            onSelect={(i) => onItemChange(i, id)}
            type={type}
          />
        </div>
      )}
    </div>
  );
}
