import type { Snowflake } from 'discord-api-types';
import { useCallback, useState } from 'react';

import type { Channel, UserGuild } from '../../../graphql/queries/UserGuild';
import { DATABASE_DEFAULTS, DATABASE_LIMITS } from '../../../utils/constants';
import Input from '../../Input';
import Header from '../Header';
import Label from '../Label';
import Selector, { OnSelectFn } from '../Selector';

interface GeneralProps {
  channels: Channel[];
  database: UserGuild['getDatabaseGuild'];
}

export default function General({ channels, database }: GeneralProps) {
  const [prefix, setPrefix] = useState(database?.prefix ?? DATABASE_DEFAULTS.prefix);
  const [blacklistedChannels, setBlacklistedChannels] = useState<Snowflake[]>(database?.blacklistedChannels ?? []);

  const handleBlacklistedChannelsChange: OnSelectFn = useCallback(
    (channelId, type) => {
      if (type === 'add') {
        return setBlacklistedChannels([...blacklistedChannels, channelId]);
      }

      const clone = [...blacklistedChannels];
      const channelIndex = clone.findIndex((i) => channelId === i);
      if (channelIndex < 0) return;

      clone.splice(channelIndex, 1);
      return setBlacklistedChannels(clone);
    },
    [blacklistedChannels],
  );

  return (
    <>
      <Header description="This panel controls the bot in your server." title="Settings" />

      <div className="flex flex-col bg-discord-slightly-darker rounded-xl w-full px-4 py-7 gap-6">
        <div className="flex flex-col gap-3">
          <Label htmlFor="prefix" name="Bot Prefix" url="https://docs.pepemanager.com/config-commands/prefix" />

          <Input
            id="prefix"
            maxLength={DATABASE_LIMITS.prefix.maxLength}
            onChange={({ target }) =>
              target.value.length <= DATABASE_LIMITS.prefix.maxLength && setPrefix(target.value)
            }
            onClear={() => setPrefix('')}
            placeholder="Enter the bot prefix"
            value={prefix}
          />
        </div>

        <div className="flex flex-col gap-3">
          <Label
            htmlFor="blacklistedChannels"
            name="Blacklisted Channels"
            url="https://docs.pepemanager.com/config-commands/config/set#command-structure"
          />

          <Selector
            id="blacklistedChannels"
            limit={DATABASE_LIMITS.blacklistedChannels.maxLength}
            initialItems={database?.blacklistedChannels ?? []}
            items={channels}
            onSelect={handleBlacklistedChannelsChange}
            type="channel"
          />
        </div>
      </div>
    </>
  );
}
