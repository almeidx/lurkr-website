import { useContext } from 'react';

import { GuildContext } from '../../../contexts/GuildContext';
import type { Channel, DatabaseGuild, Role } from '../../../graphql/queries/DashboardGuild';
import { DATABASE_LIMITS } from '../../../utils/constants';
import Field from '../../form/Field';
import Fieldset from '../../form/Fieldset';
import Input from '../../form/Input';
import Label from '../../form/Label';
import Selector from '../../form/Selector';
import Textarea from '../../form/Textarea';
import Toggle from '../../form/Toggle';
// import Header from '../Header';

interface MilestonesProps {
  channels: Channel[];
  database: DatabaseGuild;
  roles: Role[];
}

export default function Milestones({ channels, database, roles }: MilestonesProps) {
  const { addChange } = useContext(GuildContext);

  return (
    <>
      <div className="flex justify-between mx-4">
        <h1 className="text-white">Milestones</h1>
        <div className="flex flex-row gap-x-3 items-center">
          <label className="text-white" htmlFor="levels">
            Enabled
          </label>

          <Toggle
            id="milestones"
            size="small"
            initialValue={database.storeMilestones}
            onChange={(v) => addChange('storeMilestones', v)}
          />
        </div>
      </div>
      <p className="text-gray-400 font-light mt-3 mb-3 mx-4">
        Automatically announce member milestones in your server.
      </p>

      <Fieldset>
        <Field>
          <Label
            htmlFor="milestonesChannel"
            name="Milestones Channel"
            url="https://docs.pepemanager.com/guides/automatically-controlled-member-milestones#setting-the-milestones-channel"
          />
          <div className="max-w-[20rem]">
            <Selector
              id="milestonesChannel"
              initialItems={database.milestonesChannel ? [database.milestonesChannel] : []}
              items={channels}
              limit={1}
              onSelect={(c) => addChange('milestonesChannel', c[0] ?? null)}
              type="channel"
            />
          </div>
        </Field>

        <Field>
          <Label
            htmlFor="milestonesInterval"
            name="Milestones Interval"
            url="https://docs.pepemanager.com/guides/automatically-controlled-member-milestones#setting-the-milestones-interval"
          />
          <div className="max-w-[20rem]">
            <Input
              id="milestonesInterval"
              initialValue={database.milestonesInterval.toString()}
              maxLength={6}
              onChange={(t) => {
                if (t && /^\d+$/.test(t)) return addChange('milestonesInterval', parseInt(t, 10));
                addChange('milestonesInterval', 0);
              }}
              placeholder="Enter the milestones interval"
            />
          </div>
        </Field>

        <Field>
          <Label
            htmlFor="milestonesMessage"
            name="Milestone Message"
            url="https://docs.pepemanager.com/guides/automatically-controlled-member-milestones#setting-the-milestones-message"
          />
          <Textarea
            initialText={database.milestonesMessage ?? ''}
            id="milestonesMessage"
            maxLength={DATABASE_LIMITS.milestonesMessage.maxLength}
            onChange={(t) => addChange('milestonesMessage', t)}
            placeholder="Enter the milestone message"
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
            onSelect={(r) => addChange('milestonesRoles', r)}
            type="role"
          />
        </Field>
      </Fieldset>
    </>
  );
}
