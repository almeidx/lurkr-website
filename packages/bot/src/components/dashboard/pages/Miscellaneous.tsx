import type { Snowflake } from 'discord-api-types';
import { useCallback, useContext, useState } from 'react';

import { GuildChangesContext } from '../../../contexts/GuildChangesContext';
import type { Channel, DatabaseGuild } from '../../../graphql/queries/UserGuild';
import { DATABASE_DEFAULTS, DATABASE_LIMITS } from '../../../utils/constants';
import Header from '../Header';
import Label from '../Label';
import Selector, { OnSelectFn } from '../Selector';

interface MiscellaneousProps {
  channels: Channel[];
  database: DatabaseGuild | null;
}

export default function Miscellaneous({ channels, database }: MiscellaneousProps) {
  const [storeCounts, setStoreCounts] = useState(database?.storeCounts ?? DATABASE_DEFAULTS.storeCounts);
  const [autoPublishChannels, setAutoPublishChannels] = useState<Snowflake[]>(database?.autoPublishChannels ?? []);
  const { addChange } = useContext(GuildChangesContext);

  const handleAutoPublishChannelsChange: OnSelectFn = useCallback(
    (channelId, type) => {
      if (type === 'add') {
        const finalChannels = [...autoPublishChannels, channelId];
        setAutoPublishChannels(finalChannels);
        return addChange('autoPublishChannels', finalChannels);
      }

      const clone = [...autoPublishChannels];
      const channelIndex = clone.findIndex((i) => channelId === i);
      if (channelIndex < 0) return;

      clone.splice(channelIndex, 1);
      setAutoPublishChannels(clone);
      addChange('autoPublishChannels', clone);
    },
    [addChange, autoPublishChannels],
  );

  return (
    <>
      <Header description="Miscellaneous stuff that don't deserve a page of their own." title="Miscellaneous" />

      <div className="flex flex-col bg-discord-slightly-darker rounded-xl w-full px-4 py-7 gap-6">
        <div className="flex flex-col gap-3">
          <div className="flex flex-row gap-x-4 items-center">
            <Label
              htmlFor="storeCounts"
              name="Store Member Counts"
              url="https://docs.pepemanager.com/config-commands/config/toggle"
            />

            <input
              checked={storeCounts}
              className="w-4 h-4"
              type="checkbox"
              id="storeCounts"
              onChange={() => {
                setStoreCounts(!storeCounts);
                addChange('storeCounts', !storeCounts);
              }}
            />
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <Label
            htmlFor="autoPublishChannels"
            name="Auto Publish Channels"
            url="https://docs.pepemanager.com/guides/automatically-published-announcements"
          />

          <Selector
            id="autoPublishChannels"
            limit={DATABASE_LIMITS.autoPublishChannels.maxLength}
            initialItems={database?.autoPublishChannels ?? []}
            items={channels}
            onSelect={handleAutoPublishChannelsChange}
            type="channel"
          />
        </div>
      </div>
    </>
  );
}
