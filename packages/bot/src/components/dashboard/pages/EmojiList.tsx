import { useContext } from 'react';

import { GuildContext } from '../../../contexts/GuildContext';
import type { Channel, DatabaseGuild } from '../../../graphql/queries/DashboardGuild';
import Checkbox from '../../form/Checkbox';
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
      <div className="flex flex-row justify-between">
        <Header description="Automatically populate a channel with all the emojis in your server." title="Emoji List" />

        <div>
          <div className="flex flex-row gap-x-4 items-center">
            <label className="text-white" htmlFor="emojiList">
              Enabled
            </label>

            <Checkbox
              id="emojiList"
              initialValue={database.emojiList}
              onChange={(value) => addChange('emojiList', value)}
            />
          </div>
        </div>
      </div>

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
              onSelect={(channelIds) => addChange('emojiListChannel', channelIds[0] ?? null)}
              type="channel"
            />
          </div>
        </Field>
      </Fieldset>
    </>
  );
}
