import { useContext } from 'react';

import { GuildContext } from '../../../contexts/GuildContext';
import type { Channel, DatabaseGuild } from '../../../graphql/queries/DashboardGuild';
import Field from '../../form/Field';
import Fieldset from '../../form/Fieldset';
import Label from '../../form/Label';
import Selector from '../../form/Selector';
import Toggle from '../../form/Toggle';

interface EmojiListProps {
  channels: Channel[];
  database: DatabaseGuild;
}

export default function EmojiList({ channels, database }: EmojiListProps) {
  const { addChange } = useContext(GuildContext);

  return (
    <>
      <div className="flex justify-between px-4">
        <h1 className="text-white">Emoji List</h1>
        <div className="flex flex-row gap-x-3 items-center">
          <label className="text-white" htmlFor="levels">
            Enabled
          </label>

          <Toggle
            id="emojiList"
            size="small"
            initialValue={database.emojiList}
            onChange={(v) => addChange('emojiList', v)}
          />
        </div>
      </div>
      <p className="text-gray-400 font-light mt-3 mb-3 px-4">
        Automatically populate a channel with all the emojis in your server.
      </p>

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
