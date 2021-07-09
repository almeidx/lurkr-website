import { useContext } from 'react';

import { GuildContext } from '../../../contexts/GuildContext';
import type { Channel, DatabaseGuild } from '../../../graphql/queries/DashboardGuild';
import { DATABASE_LIMITS } from '../../../utils/constants';
import Field from '../../form/Field';
import Fieldset from '../../form/Fieldset';
import Input from '../../form/Input';
import Label from '../../form/Label';
import Selector from '../../form/Selector';
import Subtitle from '../../form/Subtitle';
import Header from '../Header';

interface GeneralProps {
  channels: Channel[];
  database: DatabaseGuild;
}

export default function General({ channels, database }: GeneralProps) {
  const { addChange } = useContext(GuildContext);

  return (
    <>
      <Header description="This panel controls the bot in your server." title="Settings" />

      <Fieldset>
        <Field>
          <Label htmlFor="prefix" name="Bot Prefix" url="https://docs.pepemanager.com/config-commands/prefix" />
          <Input
            id="prefix"
            initialValue={database.prefix}
            maxLength={DATABASE_LIMITS.prefix.maxLength}
            onChange={(t) => addChange('prefix', t)}
            placeholder="Enter the bot prefix"
          />
          <Subtitle text={`Maximum of ${DATABASE_LIMITS.prefix.maxLength} characters.`} />
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
            onSelect={(c) => addChange('blacklistedChannels', c)}
            type="channel"
          />
          <Subtitle text={`Maximum of ${DATABASE_LIMITS.blacklistedChannels.maxLength} channels.`} />
        </Field>
      </Fieldset>
    </>
  );
}
