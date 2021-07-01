import type { Snowflake } from 'discord-api-types';
import { useCallback, useState } from 'react';

import type { Channel, DatabaseGuild, Role } from '../../../graphql/queries/UserGuild';
import { DATABASE_DEFAULTS, DATABASE_LIMITS } from '../../../utils/constants';
import Input from '../../Input';
import Header from '../Header';
import Label from '../Label';
import Selector, { OnSelectFn } from '../Selector';

interface MilestonesProps {
  channels: Channel[];
  database: DatabaseGuild | null;
  roles: Role[];
}

export default function Milestones({ channels, database, roles }: MilestonesProps) {
  const [storeMilestones, setStoreMilestones] = useState<boolean>(
    database?.storeMilestones ?? DATABASE_DEFAULTS.storeMilestones,
  );
  const [milestonesChannel, setMilestonesChannel] = useState<Snowflake | null>(database?.milestonesChannel ?? null);
  const [milestonesInterval, setMilestonesInterval] = useState<string>(
    database?.milestonesInterval.toString() ?? DATABASE_DEFAULTS.milestonesInterval.toString(),
  );
  const [milestoneMessage, setMilestoneMessage] = useState<string>(
    database?.milestonesMessage ?? DATABASE_DEFAULTS.milestonesMessage,
  );
  const [milestoneRoles, setMilestoneRoles] = useState<Snowflake[]>(database?.milestonesRoles ?? []);

  const handleMilestoneRolesChange: OnSelectFn = useCallback(
    (roleId, type) => {
      if (type === 'add') {
        return setMilestoneRoles([...milestoneRoles, roleId]);
      }

      const clone = [...milestoneRoles];
      const channelIndex = clone.findIndex((i) => roleId === i);
      if (channelIndex < 0) return;

      clone.splice(channelIndex, 1);
      return setMilestoneRoles(clone);
    },
    [milestoneRoles],
  );

  return (
    <>
      <div className="flex flex-row justify-between">
        <Header description="Automatically announce member milestones in your server." title="Milestones" />

        <div>
          <div className="flex flex-row gap-x-4 items-center">
            <label className="text-white" htmlFor="milestones">
              Enabled
            </label>

            <input
              checked={storeMilestones}
              className="w-4 h-4"
              type="checkbox"
              id="milestones"
              onChange={() => setStoreMilestones(!storeMilestones)}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col bg-discord-slightly-darker rounded-xl w-full px-4 py-7 gap-6">
        <div className="flex flex-col gap-3">
          <Label
            htmlFor="milestonesChannel"
            name="Milestones Channel"
            url="https://docs.pepemanager.com/guides/automatically-controlled-member-milestones#setting-the-milestones-channel"
          />

          <Selector
            id="milestonesChannel"
            initialItems={milestonesChannel ? [milestonesChannel] : []}
            items={channels}
            limit={1}
            onSelect={(channelId, type) => setMilestonesChannel(type === 'add' ? channelId : null)}
            type="channel"
          />
        </div>

        <div className="flex flex-col gap-3">
          <Label
            htmlFor="milestonesInterval"
            name="Milestones Interval"
            url="https://docs.pepemanager.com/guides/automatically-controlled-member-milestones#setting-the-milestones-interval"
          />

          <Input
            id="milestonesInterval"
            maxLength={6}
            onChange={(e) =>
              e.target.value
                ? /^\d+$/.test(e.target.value) && setMilestonesInterval(e.target.value)
                : setMilestonesInterval('')
            }
            onClear={() => setMilestonesInterval('')}
            placeholder="Enter the milestones interval"
            value={milestonesInterval.toString()}
          />
        </div>

        <div className="flex flex-col gap-3">
          <Label
            htmlFor="milestonesMessage"
            name="Milestone Message"
            url="https://docs.pepemanager.com/guides/automatically-controlled-member-milestones#setting-the-milestones-message"
          />

          <Input
            id="milestonesMessage"
            maxLength={DATABASE_LIMITS.milestonesMessage.maxLength}
            onChange={(e) => setMilestoneMessage(e.target.value)}
            onClear={() => setMilestoneMessage('')}
            placeholder="Enter the milestone message"
            value={milestoneMessage}
          />
        </div>

        <div className="flex flex-col gap-3">
          <Label
            htmlFor="milestoneRoles"
            name="Milestone Roles"
            url="https://docs.pepemanager.com/guides/automatically-controlled-member-milestones#setting-the-milestones-role"
          />

          <Selector
            id="milestoneRoles"
            initialItems={database?.milestonesRoles ?? []}
            items={roles}
            limit={DATABASE_LIMITS.milestonesRoles.maxLength}
            onSelect={handleMilestoneRolesChange}
            type="role"
          />
        </div>
      </div>
    </>
  );
}
