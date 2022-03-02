import type { Snowflake } from 'discord-api-types/globals';
import { useContext, useEffect } from 'react';

import { GuildContext } from '../../../contexts/GuildContext';
import type {
  DashboardChannels,
  DashboardDatabaseGuild,
  DashboardRoles,
} from '../../../graphql/queries/DashboardGuild';
import { getDatabaseLimit, parseIntStrict } from '../../../utils/utils';
import Field from '../../form/Field';
import Fieldset from '../../form/Fieldset';
import Input from '../../form/Input';
import Label from '../../form/Label';
import Selector from '../../form/Selector';
import Subtitle from '../../form/Subtitle';
import Textarea from '../../form/Textarea';
import Header from '../Header';

interface MilestonesProps {
  channels: DashboardChannels;
  database: DashboardDatabaseGuild;
  roles: DashboardRoles;
  openMenu: () => void;
}

export default function Milestones({ channels, database, roles, openMenu }: MilestonesProps) {
  const { addChange } = useContext(GuildContext);

  const milestonesIntervalLimits = getDatabaseLimit('milestonesInterval', database.premium);
  const milestonesMessageLimit = getDatabaseLimit('milestonesMessage', database.premium).maxLength;
  const milestonesRolesLimit = getDatabaseLimit('milestonesRoles', database.premium).maxLength;

  useEffect(() => {
    window.scroll({ behavior: 'auto', left: 0, top: 0 });
  }, [openMenu]);

  return (
    <>
      <Header
        openMenu={openMenu}
        description="Automatically announce member milestones in your server."
        id="milestones"
        initialValue={database.storeMilestones}
        onChange={(v) => addChange('storeMilestones', v)}
        title="Milestones"
      />

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
              onChange={(t) => addChange('milestonesInterval', t ? parseIntStrict(t) : 0)}
              placeholder="Enter the milestones interval"
            />
          </div>
          <Subtitle
            text={`Between ${milestonesIntervalLimits.min} - ${milestonesIntervalLimits.max.toLocaleString('en')}.`}
          />
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
            maxLength={milestonesMessageLimit}
            onChange={(t) => addChange('milestonesMessage', t)}
            placeholder="Enter the milestone message"
          />
          <Subtitle text={`Maximum of ${milestonesMessageLimit.toLocaleString('en')} characters.`} />
        </Field>

        <Field>
          <Label
            htmlFor="milestoneRoles"
            name="Milestone Roles"
            url="https://docs.pepemanager.com/guides/automatically-controlled-member-milestones#setting-the-milestones-role"
          />
          <Selector
            id="milestoneRoles"
            initialItems={(database.milestonesRoles as Snowflake[] | null) ?? []}
            items={roles}
            limit={milestonesRolesLimit}
            onSelect={(r) => addChange('milestonesRoles', r)}
            type="role"
          />
          <Subtitle text={`Maximum of ${milestonesRolesLimit} roles.`} />
        </Field>
      </Fieldset>
    </>
  );
}
