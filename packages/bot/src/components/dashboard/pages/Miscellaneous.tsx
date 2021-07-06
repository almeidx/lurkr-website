import { useContext } from 'react';

import { GuildContext } from '../../../contexts/GuildContext';
import type { Channel, DatabaseGuild } from '../../../graphql/queries/DashboardGuild';
import { DATABASE_LIMITS } from '../../../utils/constants';
import Checkbox from '../../form/Checkbox';
import Field from '../../form/Field';
import Fieldset from '../../form/Fieldset';
import Label from '../../form/Label';
import Selector from '../../form/Selector';
import Header from '../Header';

interface MiscellaneousProps {
  channels: Channel[];
  database: DatabaseGuild;
}

export default function Miscellaneous({ channels, database }: MiscellaneousProps) {
  const { addChange } = useContext(GuildContext);

  return (
    <>
      <Header description="Miscellaneous stuff that don't deserve a page of their own." title="Miscellaneous" />

      <Fieldset>
        <Field direction="row">
          <div className="flex flex-row items-center text-center gap-x-3">
            <Checkbox
              id="storeCounts"
              initialValue={database.storeCounts}
              onChange={(value) => addChange('storeCounts', value)}
            />
            <Label
              htmlFor="storeCounts"
              name="Store Member Counts"
              url="https://docs.pepemanager.com/config-commands/config/toggle"
            />
          </div>
        </Field>

        <Field>
          <Label
            htmlFor="autoPublishChannels"
            name="Auto Publish Channels"
            url="https://docs.pepemanager.com/guides/automatically-published-announcements"
          />
          <Selector
            id="autoPublishChannels"
            limit={DATABASE_LIMITS.autoPublishChannels.maxLength}
            initialItems={database.autoPublishChannels ?? []}
            items={channels}
            onSelect={(channelIds) => addChange('autoPublishChannels', channelIds)}
            type="channel"
          />
        </Field>
      </Fieldset>
    </>
  );
}
