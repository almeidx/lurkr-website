import { MdClear } from 'react-icons/md';

import type { DashboardChannels, DashboardDatabaseGuild, DashboardRoles } from '../../graphql/queries/DashboardGuild';
import type { Snowflake } from '../../utils/constants';
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
    <div className="flex relative flex-row flex-wrap gap-y-2 justify-between p-2 w-full bg-discord-dark rounded-lg">
      <div className="flex w-full">
        <label className="flex items-center ml-4 w-[6rem] font-bold text-white" htmlFor={`m-${id}-selector`}>
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
          className="right-0 py-3 mr-4 ml-auto w-6 h-full text-2xl text-discord-red active:text-red-600 transition-colors cursor-pointer"
          onClick={() => onDelete(id)}
        >
          <MdClear />
        </div>
      </div>

      {type !== 'global' && targets && (
        <div className="mx-2 w-full">
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
