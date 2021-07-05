import type { Snowflake } from 'discord-api-types';
import { useCallback, useContext, useState } from 'react';

import { GuildContext } from '../../../contexts/GuildContext';
import type { Channel, DatabaseGuild, Role } from '../../../graphql/queries/DashboardGuild';
import { DATABASE_DEFAULTS, DATABASE_LIMITS } from '../../../utils/constants';
import Field from '../../form/Field';
import Fieldset from '../../form/Fieldset';
import Input from '../../form/Input';
import Label from '../../form/Label';
import Selector, { OnSelectFn } from '../../form/Selector';
import Header from '../Header';

interface MilestonesProps {
  channels: Channel[];
  database: DatabaseGuild;
  roles: Role[];
}

export default function Milestones({ channels, database, roles }: MilestonesProps) {
  const [storeMilestones, setStoreMilestones] = useState<boolean>(database.storeMilestones);
  const [milestonesChannel, setMilestonesChannel] = useState<Snowflake | null>(database.milestonesChannel ?? null);
  const [milestonesInterval, setMilestonesInterval] = useState<string>(database.milestonesInterval.toString());
  const [milestoneMessage, setMilestoneMessage] = useState<string>(
    database.milestonesMessage ?? DATABASE_DEFAULTS.milestonesMessage,
  );
  const [milestoneRoles, setMilestoneRoles] = useState<Snowflake[]>(database.milestonesRoles ?? []);
  const { addChange } = useContext(GuildContext);

  const handleMilestoneRolesChange: OnSelectFn = useCallback(
    (roleId, type) => {
      if (type === 'add') {
        const finalRoles = [...milestoneRoles, roleId];
        setMilestoneRoles(finalRoles);
        return addChange('milestonesRoles', finalRoles);
      }

      const clone = [...milestoneRoles];
      const channelIndex = clone.findIndex((i) => roleId === i);
      if (channelIndex < 0) return;

      clone.splice(channelIndex, 1);
      setMilestoneRoles(clone);
      addChange('milestonesRoles', clone);
    },
    [addChange, milestoneRoles],
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
              onChange={() => {
                setStoreMilestones(!storeMilestones);
                addChange('storeMilestones', !storeMilestones);
              }}
            />
          </div>
        </div>
      </div>

      <Fieldset>
        <Field>
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
            onSelect={(channelId, type) => {
              const finalChannel = type === 'add' ? channelId : null;
              setMilestonesChannel(finalChannel);
              addChange('milestonesChannel', finalChannel);
            }}
            type="channel"
          />
        </Field>

        <Field>
          <Label
            htmlFor="milestonesInterval"
            name="Milestones Interval"
            url="https://docs.pepemanager.com/guides/automatically-controlled-member-milestones#setting-the-milestones-interval"
          />
          <Input
            id="milestonesInterval"
            maxLength={6}
            onChange={({ target }) => {
              if (target.value && /^\d+$/.test(target.value)) {
                setMilestonesInterval(target.value);
                return addChange('milestonesInterval', parseInt(target.value, 10));
              }
              setMilestonesInterval('');
              addChange('milestonesInterval', 0);
            }}
            onClear={() => {
              setMilestonesInterval('');
              addChange('milestonesInterval', 0);
            }}
            placeholder="Enter the milestones interval"
            value={milestonesInterval.toString()}
          />
        </Field>

        <Field>
          <Label
            htmlFor="milestonesMessage"
            name="Milestone Message"
            url="https://docs.pepemanager.com/guides/automatically-controlled-member-milestones#setting-the-milestones-message"
          />
          <Input
            id="milestonesMessage"
            maxLength={DATABASE_LIMITS.milestonesMessage.maxLength}
            onChange={({ target }) => {
              if (target.value.length > DATABASE_LIMITS.milestonesMessage.maxLength) return;
              setMilestoneMessage(target.value);
              addChange('milestonesMessage', target.value);
            }}
            onClear={() => {
              setMilestoneMessage('');
              addChange('milestonesMessage', '');
            }}
            placeholder="Enter the milestone message"
            value={milestoneMessage}
          />
        </Field>

        <Field>
          <Label
            htmlFor="milestoneRoles"
            name="Milestone Roles"
            url="https://docs.pepemanager.com/guides/automatically-controlled-member-milestones#setting-the-milestones-role"
          />
          <Selector
            id="milestoneRoles"
            initialItems={database.milestonesRoles ?? []}
            items={roles}
            limit={DATABASE_LIMITS.milestonesRoles.maxLength}
            onSelect={handleMilestoneRolesChange}
            type="role"
          />
        </Field>
      </Fieldset>
    </>
  );
}
