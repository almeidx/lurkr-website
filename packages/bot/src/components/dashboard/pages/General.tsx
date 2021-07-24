import { useContext, useEffect } from 'react';

import { GuildContext } from '../../../contexts/GuildContext';
import type { Channel, DatabaseGuild } from '../../../graphql/queries/DashboardGuild';
import { getDatabaseLimit } from '../../../utils/utils';
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
  openMenu(): void;
}

export default function General({ channels, database, openMenu }: GeneralProps) {
  const { addChange } = useContext(GuildContext);

  const prefixLimit = getDatabaseLimit('prefix', database.premium).maxLength;
  const blacklistedChannelsLimit = getDatabaseLimit('blacklistedChannels', database.premium).maxLength;

  useEffect(() => {
    window.scroll({ behavior: 'auto', left: 0, top: 0 });
  }, [openMenu]);

  return (
    <>
      <Header openMenu={openMenu} description="This panel controls the bot in your server." title="Settings" />

      <Fieldset>
        <Field>
          <Label htmlFor="prefix" name="Bot Prefix" url="https://docs.pepemanager.com/config-commands/prefix" />
          <Input
            id="prefix"
            initialValue={database.prefix}
            maxLength={prefixLimit}
            onChange={(t) => addChange('prefix', t)}
            placeholder="Enter the bot prefix"
          />
          <Subtitle text={`Maximum of ${prefixLimit} characters.`} />
        </Field>

        <Field>
          <Label
            htmlFor="blacklistedChannels"
            name="Blacklisted Channels"
            url="https://docs.pepemanager.com/config-commands/config/set#command-structure"
          />
          <Selector
            id="blacklistedChannels"
            limit={blacklistedChannelsLimit}
            initialItems={database.blacklistedChannels ?? []}
            items={channels}
            onSelect={(c) => addChange('blacklistedChannels', c)}
            type="channel"
          />
          <Subtitle text={`Maximum of ${blacklistedChannelsLimit} channels.`} />
        </Field>
      </Fieldset>
    </>
  );
}
