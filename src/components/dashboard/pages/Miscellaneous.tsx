import type { Snowflake } from 'discord-api-types/globals';
import { useContext, useEffect } from 'react';

import { GuildContext } from '../../../contexts/GuildContext';
import type { DashboardChannels, DashboardDatabaseGuild } from '../../../graphql/queries/DashboardGuild';
import { getDatabaseLimit } from '../../../utils/utils';
import Field from '../../form/Field';
import Fieldset from '../../form/Fieldset';
import Label from '../../form/Label';
import Selector from '../../form/Selector';
import Subtitle from '../../form/Subtitle';
import Toggle from '../../form/Toggle';
import Header from '../Header';

interface MiscellaneousProps {
  channels: DashboardChannels;
  database: DashboardDatabaseGuild;
  openMenu: () => void;
}

export default function Miscellaneous({ channels, database, openMenu }: MiscellaneousProps) {
  const { addChange } = useContext(GuildContext);

  const autoPublishChannelsLimit = getDatabaseLimit('autoPublishChannels', database.premium).maxLength;

  useEffect(() => {
    window.scroll({ behavior: 'auto', left: 0, top: 0 });
  }, [openMenu]);

  return (
    <>
      <Header
        openMenu={openMenu}
        description="Miscellaneous options that don't fit into any other category."
        title="Miscellaneous"
      />

      <Fieldset>
        <Field direction="row">
          <div className="flex flex-row w-full justify-between p-2 pl-4 gap-x-3 items-center rounded-lg bg-discord-dark">
            <Label
              htmlFor="storeCounts"
              name="Store Member Counts"
              url="https://docs.pepemanager.com/config-commands/config/toggle"
              withMargin={false}
            />
            <Toggle
              size="small"
              id="storeCounts"
              initialValue={database.storeCounts}
              onChange={(v) => addChange('storeCounts', v)}
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
            limit={autoPublishChannelsLimit}
            initialItems={(database.autoPublishChannels as Snowflake[] | null) ?? []}
            items={channels}
            onSelect={(c) => addChange('autoPublishChannels', c)}
            type="channel"
          />
          <Subtitle text={`Maximum of ${autoPublishChannelsLimit} channels.`} />
        </Field>
      </Fieldset>
    </>
  );
}
