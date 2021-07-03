import type { Snowflake } from 'discord-api-types';
import { useCallback, useContext, useState } from 'react';

import { GuildContext } from '../../../contexts/GuildContext';
import type { Channel, DatabaseGuild } from '../../../graphql/queries/DashboardGuild';
import { DATABASE_DEFAULTS, DATABASE_LIMITS } from '../../../utils/constants';
import Field from '../../Form/Field';
import Fieldset from '../../Form/Fieldset';
import Input from '../../Form/Input';
import Label from '../../Form/Label';
import Selector, { OnSelectFn } from '../../Form/Selector';
import Header from '../Header';

interface GeneralProps {
  channels: Channel[];
  database: DatabaseGuild | null;
}

export default function General({ channels, database }: GeneralProps) {
  const [prefix, setPrefix] = useState(database?.prefix ?? DATABASE_DEFAULTS.prefix);
  const [blacklistedChannels, setBlacklistedChannels] = useState<Snowflake[]>(database?.blacklistedChannels ?? []);
  const { addChange } = useContext(GuildContext);

  const handleBlacklistedChannelsChange: OnSelectFn = useCallback(
    (channelId, type) => {
      if (type === 'add') {
        const finalChannels = [...blacklistedChannels, channelId];
        setBlacklistedChannels(finalChannels);
        return addChange('blacklistedChannels', finalChannels);
      }

      const clone = [...blacklistedChannels];
      const channelIndex = clone.findIndex((i) => channelId === i);
      if (channelIndex < 0) return;

      clone.splice(channelIndex, 1);
      setBlacklistedChannels(clone);
      addChange('blacklistedChannels', clone);
    },
    [addChange, blacklistedChannels],
  );

  return (
    <>
      <Header description="This panel controls the bot in your server." title="Settings" />
      <Fieldset>
        <Field>
          <Label htmlFor="prefix" name="Bot Prefix" url="https://docs.pepemanager.com/config-commands/prefix" />
          <Input
            id="prefix"
            maxLength={DATABASE_LIMITS.prefix.maxLength}
            onChange={({ target }) => {
              if (target.value.length <= DATABASE_LIMITS.prefix.maxLength) {
                setPrefix(target.value);
                addChange('prefix', target.value);
              }
            }}
            onClear={() => {
              setPrefix('');
              addChange('prefix', '');
            }}
            placeholder="Enter the bot prefix"
            value={prefix}
          />
        </Field>
        <Field>
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
        </Field>
      </Fieldset>
    </>
  );
}
