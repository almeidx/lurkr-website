import type { Snowflake } from 'discord-api-types';
import { ChangeEvent, useCallback, useState } from 'react';

import type { Channel, UserGuild } from '../../../graphql/queries/UserGuild';
import Input from '../../Input';
import Header from '../Header';
import Label from '../Label';
import Selector from '../Selector';

interface GeneralProps {
  channels: Channel[];
  database: UserGuild['getDatabaseGuild'];
}

export default function General({ channels, database }: GeneralProps) {
  const [prefix, setPrefix] = useState(database?.prefix ?? 'p!');
  const [blacklistedChannels, setBlacklistedChannels] = useState<Snowflake[]>(database?.blacklistedChannels ?? []);

  const handlePrefixChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    if (value.length <= 5) {
      setPrefix(value);
    }
  }, []);

  const handleBlacklistedChannelsChange = useCallback(
    (itemId: Snowflake, type: 'add' | 'remove') => {
      const clone = [...blacklistedChannels];
      if (type === 'add') {
        return setBlacklistedChannels([...clone, itemId]);
      }

      const channelIndex = clone.findIndex((i) => itemId === i);
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
            maxLength={5}
            onChange={handlePrefixChange}
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
