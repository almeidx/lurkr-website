import { useContext } from 'react';

import { GuildContext } from '../../../contexts/GuildContext';
import type { Channel, DatabaseGuild } from '../../../graphql/queries/DashboardGuild';
import Field from '../../form/Field';
import Fieldset from '../../form/Fieldset';
import Label from '../../form/Label';
import Selector from '../../form/Selector';
import Header from '../Header';

interface EmojiListProps {
  channels: Channel[];
  database: DatabaseGuild;
}

export default function EmojiList({ channels, database }: EmojiListProps) {
  const { addChange } = useContext(GuildContext);

  return (
    <>
      <Header
        description="Automatically populate a channel with all the emojis in your server."
        id="emojiList"
        initialValue={database.emojiList}
        onChange={(v) => addChange('emojiList', v)}
        title="Emoji List"
      />

      <Fieldset>
        <Field>
          <Label
            htmlFor="emojiListChannel"
            name="Emoji List Channel"
            url="https://docs.pepemanager.com/guides/automatically-controlled-emoji-list"
          />
          <div className="max-w-[20rem]">
            <Selector
              id="emojiListChannel"
              limit={1}
              initialItems={database.emojiListChannel ? [database.emojiListChannel] : []}
              items={channels}
              onSelect={(c) => addChange('emojiListChannel', c[0] ?? null)}
              type="channel"
            />
          </div>
        </Field>
      </Fieldset>
    </>
  );
}
