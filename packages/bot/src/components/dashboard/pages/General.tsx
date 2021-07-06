import { useContext, useState } from 'react';

import { GuildContext } from '../../../contexts/GuildContext';
import type { Channel, DatabaseGuild } from '../../../graphql/queries/DashboardGuild';
import { DATABASE_LIMITS } from '../../../utils/constants';
import Field from '../../form/Field';
import Fieldset from '../../form/Fieldset';
import Input from '../../form/Input';
import Label from '../../form/Label';
import Selector from '../../form/Selector';
import Header from '../Header';

interface GeneralProps {
  channels: Channel[];
  database: DatabaseGuild;
}

export default function General({ channels, database }: GeneralProps) {
  const [prefix, setPrefix] = useState(database.prefix);
  const { addChange } = useContext(GuildContext);

  return (
    <>
      <Header description="This panel controls the bot in your server." title="Settings" />
      <Fieldset>
        <Field>
          <Label htmlFor="prefix" name="Bot Prefix" url="https://docs.pepemanager.com/config-commands/prefix" />
          <div className="max-w-[20rem]">
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
          </div>
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
            initialItems={database.blacklistedChannels ?? []}
            items={channels}
            onSelect={(channelIds) => addChange('blacklistedChannels', channelIds)}
            type="channel"
          />
        </Field>
      </Fieldset>
    </>
  );
}
